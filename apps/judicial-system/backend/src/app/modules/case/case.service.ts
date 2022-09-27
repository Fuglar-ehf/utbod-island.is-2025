import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import { Includeable, OrderItem, Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'
import { Attachment } from 'nodemailer/lib/mailer'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { MessageType } from '@island.is/judicial-system/message'
import { EmailService } from '@island.is/email-service'
import {
  CaseFileState,
  CaseOrigin,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../factories'
import {
  getRequestPdfAsBuffer,
  getRulingPdfAsString,
  getCasefilesPdfAsString,
  writeFile,
  getRulingPdfAsBuffer,
  getCustodyNoticePdfAsBuffer,
  stripHtmlTags,
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  formatCourtUploadRulingTitle,
  formatRulingModifiedHistory,
} from '../../formatters'
import { courtUpload, notifications as m } from '../../messages'
import { CaseFile, FileService } from '../file'
import { DefendantService, Defendant } from '../defendant'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CaseEvent, EventService } from '../event'
import { PoliceService } from '../police'
import { CreateCaseDto } from './dto/createCase.dto'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { getCasesQueryFilter, oldFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { ArchiveResponse } from './models/archive.response'
import { DeliverResponse } from './models/deliver.response'
import { caseModuleConfig } from './case.config'

const caseEncryptionProperties: (keyof Case)[] = [
  'description',
  'demands',
  'lawsBroken',
  'legalBasis',
  'requestedOtherRestrictions',
  'caseFacts',
  'legalArguments',
  'prosecutorOnlySessionRequest',
  'comments',
  'caseFilesComments',
  'courtAttendees',
  'prosecutorDemands',
  'courtDocuments',
  'sessionBookings',
  'courtCaseFacts',
  'introduction',
  'courtLegalArguments',
  'ruling',
  'conclusion',
  'endOfSessionBookings',
  'accusedAppealAnnouncement',
  'prosecutorAppealAnnouncement',
  'caseModifiedExplanation',
  'caseResentExplanation',
]

const defendantEncryptionProperties: (keyof Defendant)[] = [
  'nationalId',
  'name',
  'address',
]

const caseFileEncryptionProperties: (keyof CaseFile)[] = ['name', 'key']

function collectEncryptionProperties(
  properties: string[],
  unknownSource: unknown,
): [{ [key: string]: string | null }, { [key: string]: unknown }] {
  const source = unknownSource as { [key: string]: unknown }
  return properties.reduce<
    [{ [key: string]: string | null }, { [key: string]: unknown }]
  >(
    (data, property) => [
      {
        ...data[0],
        [property]: typeof source[property] === 'string' ? '' : null,
      },
      { ...data[1], [property]: source[property] },
    ],
    [{}, {}],
  )
}

const includes: Includeable[] = [
  { model: Defendant, as: 'defendants' },
  { model: Institution, as: 'court' },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Case, as: 'parentCase' },
  { model: Case, as: 'childCase' },
]

const defendantsOrder: OrderItem = [
  { model: Defendant, as: 'defendants' },
  'created',
  'ASC',
]

@Injectable()
export class CaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(CaseArchive)
    private readonly caseArchiveModel: typeof CaseArchive,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly defendantService: DefendantService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @InjectQueue(caseModuleConfig().sqs.queueName)
    private queueService: QueueService,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private refreshFormatMessage: () => Promise<void> = async () =>
    this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })

  private async uploadSignedRulingPdfToS3(
    theCase: Case,
    pdf: string,
  ): Promise<boolean> {
    return this.awsS3Service
      .putObject(`generated/${theCase.id}/ruling.pdf`, pdf)
      .then(() => true)
      .catch((reason) => {
        this.logger.error(
          `Failed to upload signed ruling pdf to AWS S3 for case ${theCase.id}`,
          { reason },
        )

        return false
      })
  }

  private async uploadSignedRulingPdfToCourt(
    theCase: Case,
    buffer: Buffer,
    user?: TUser,
  ): Promise<boolean> {
    if (!this.config.production) {
      writeFile(`${theCase.id}-ruling-signed.pdf`, buffer)
    }

    try {
      await this.courtService.createRuling(
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        formatCourtUploadRulingTitle(
          this.formatMessage,
          theCase.courtCaseNumber,
          Boolean(theCase.rulingDate),
        ),
        buffer,
        user,
      )

      return true
    } catch (error) {
      this.logger.error(
        `Failed to upload signed ruling pdf to court for case ${theCase.id}`,
        { error },
      )

      return false
    }
  }

  private async uploadCourtRecordPdfToCourt(theCase: Case): Promise<boolean> {
    try {
      const pdf = await getCourtRecordPdfAsBuffer(theCase, this.formatMessage)

      if (!this.config.production) {
        writeFile(`${theCase.id}-court-record.pdf`, pdf)
      }

      await this.courtService.createCourtRecord(
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        this.formatMessage(courtUpload.courtRecord, {
          courtCaseNumber: theCase.courtCaseNumber,
        }),
        pdf,
      )

      return true
    } catch (error) {
      // Log and ignore this error. The court record can be uploaded manually.
      this.logger.error(
        `Failed to upload court record pdf to court for case ${theCase.id}`,
        { error },
      )

      return false
    }
  }

  private async uploadCaseFilesPdfToCourt(theCase: Case): Promise<void> {
    try {
      if (theCase.caseFiles && theCase.caseFiles.length > 0) {
        const caseFilesPdf = await getCasefilesPdfAsString(theCase)

        if (!this.config.production) {
          writeFile(`${theCase.id}-case-files.pdf`, caseFilesPdf)
        }

        const buffer = Buffer.from(caseFilesPdf, 'binary')

        await this.courtService.createDocument(
          theCase.id,
          theCase.courtId ?? '',
          theCase.courtCaseNumber ?? '',
          'Rannsóknargögn',
          'Rannsóknargögn.pdf',
          'application/pdf',
          buffer,
        )
      }
    } catch (error) {
      // Log and ignore this error. The overview is not that critical.
      this.logger.error(
        `Failed to upload case files overview pdf to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private async sendEmailToCourt(
    theCase: Case,
    subject: string,
    body: string,
    attachment?: Attachment,
  ) {
    const to = [
      {
        name: theCase.judge?.name ?? '',
        address: theCase.judge?.email ?? '',
      },
    ]
    if (theCase.registrar) {
      to.push({
        name: theCase.registrar?.name ?? '',
        address: theCase.registrar?.email ?? '',
      })
    }

    try {
      await this.emailService.sendEmail({
        from: {
          name: this.config.email.fromName,
          address: this.config.email.fromEmail,
        },
        replyTo: {
          name: this.config.email.replyToName,
          address: this.config.email.replyToEmail,
        },
        to: to,
        subject,
        text: stripHtmlTags(body),
        html: body,
        attachments: attachment ? [attachment] : [],
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })

      this.eventService.postErrorEvent(
        'Failed to send email',
        {
          subject,
          to: to.reduce(
            (acc, recipient, index) =>
              index > 0
                ? `${acc}, ${recipient.name} (${recipient.address})`
                : `${recipient.name} (${recipient.address})`,
            '',
          ),
          attachments: attachment && `${attachment.filename}`,
        },
        error as Error,
      )
    }
  }

  private async uploadSignedRulingPdf(
    theCase: Case,
    user: TUser,
    signedRulingPdf: string,
  ): Promise<void> {
    await this.refreshFormatMessage()

    const rulingUploaded = await this.uploadSignedRulingPdfToS3(
      theCase,
      signedRulingPdf,
    ).then((success) => {
      if (!success) {
        const buffer = Buffer.from(signedRulingPdf, 'binary')

        return this.uploadSignedRulingPdfToCourt(theCase, buffer, user)
      }

      return success
    })

    if (!rulingUploaded) {
      this.sendEmailToCourt(
        theCase,
        this.formatMessage(m.signedRuling.subjectV2, {
          courtCaseNumber: theCase.courtCaseNumber,
          isModifyingRuling: Boolean(theCase.rulingDate),
        }),
        this.formatMessage(m.signedRuling.courtBody, {
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
          linkEnd: '</a>',
        }),
        {
          filename: this.formatMessage(m.signedRuling.rulingAttachment, {
            courtCaseNumber: theCase.courtCaseNumber,
          }),
          content: signedRulingPdf,
          encoding: 'binary',
        },
      )
    }
  }

  private async deliverSignedRulingToCourt(theCase: Case): Promise<boolean> {
    return this.awsS3Service
      .getObject(`generated/${theCase.id}/ruling.pdf`)
      .then((pdf) =>
        this.uploadSignedRulingPdfToCourt(theCase, pdf).catch(() => false),
      )
      .catch(() => {
        // The signed ruling should have been delivered to the court
        // either directly to the court system or via email
        this.logger.info(
          `The ruling for case ${theCase.id} was not found in AWS S3`,
          { caseId: theCase.id },
        )

        return true
      })
  }

  private deliverCourtRecordToCourt(theCase: Case): Promise<boolean> {
    return this.uploadCourtRecordPdfToCourt(theCase)
  }

  private async deliverCaseFilesToCourt(theCase: Case): Promise<boolean> {
    return this.fileService
      .getAllCaseFiles(theCase.id)
      .then(async (caseFiles) => {
        let success = true

        for (const caseFile of caseFiles.filter(
          (caseFile) => caseFile.state === CaseFileState.STORED_IN_RVG,
        )) {
          const uploaded = await this.fileService
            .uploadCaseFileToCourt(
              caseFile,
              theCase.id,
              theCase.courtId,
              theCase.courtCaseNumber,
            )
            .then((response) => response.success)
            .catch((reason) => {
              this.logger.error(
                `Failed to upload file ${caseFile.id} of case ${theCase.id} to court`,
                { reason },
              )

              return false
            })

          success = success && uploaded
        }

        theCase.caseFiles = caseFiles
        await this.uploadCaseFilesPdfToCourt(theCase)

        return success
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to upload case files of case ${theCase.id} to court`,
          { reason },
        )

        return false
      })
  }

  private async deliverCaseToPolice(theCase: Case): Promise<boolean> {
    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)
    const defendantNationalIds = theCase.defendants?.reduce<string[]>(
      (ids, defendant) =>
        !defendant.noNationalId && defendant.nationalId
          ? [...ids, defendant.nationalId]
          : ids,
      [],
    )

    return this.policeService.updatePoliceCase(
      theCase.id,
      theCase.type,
      theCase.state,
      pdf,
      theCase.policeCaseNumbers,
      defendantNationalIds,
      theCase.conclusion,
    )
  }

  private async createCase(
    caseToCreate: CreateCaseDto,
    transaction?: Transaction,
  ): Promise<string> {
    const theCase = await (transaction
      ? this.caseModel.create({ ...caseToCreate }, { transaction })
      : this.caseModel.create({ ...caseToCreate }))

    return theCase.id
  }

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      include: includes,
      order: [defendantsOrder],
      where: {
        id: caseId,
        state: { [Op.not]: CaseState.DELETED },
        isArchived: false,
      },
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  async findOriginalAncestor(theCase: Case): Promise<Case> {
    let originalAncestor: Case = theCase

    while (originalAncestor.parentCaseId) {
      const parentCase = await this.caseModel.findOne({
        where: { id: originalAncestor.parentCaseId },
      })

      if (!parentCase) {
        throw new InternalServerErrorException(
          `Original ancestor of case ${theCase.id} not found`,
        )
      }

      originalAncestor = parentCase
    }

    return originalAncestor
  }

  async getAll(user: TUser): Promise<Case[]> {
    return this.caseModel.findAll({
      include: includes,
      order: [defendantsOrder],
      where: getCasesQueryFilter(user),
    })
  }

  async internalCreate(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    let prosecutorId: string | undefined
    let courtId: string | undefined

    if (caseToCreate.prosecutorNationalId) {
      const prosecutor = await this.userService.findByNationalId(
        caseToCreate.prosecutorNationalId,
      )

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        throw new BadRequestException(
          `User ${
            prosecutor?.id ?? 'unknown'
          } is not registered as a prosecutor`,
        )
      }

      prosecutorId = prosecutor.id
      courtId = prosecutor.institution?.defaultCourtId
    }

    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            ...caseToCreate,
            origin: CaseOrigin.LOKE,
            creatingProsecutorId: prosecutorId,
            prosecutorId,
            courtId,
          } as InternalCreateCaseDto,
          transaction,
        )

        await this.defendantService.create(
          caseId,
          {
            nationalId: caseToCreate.accusedNationalId,
            name: caseToCreate.accusedName,
            gender: caseToCreate.accusedGender,
            address: caseToCreate.accusedAddress,
          },
          transaction,
        )

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async create(caseToCreate: CreateCaseDto, prosecutor: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            ...caseToCreate,
            origin: CaseOrigin.RVG,
            creatingProsecutorId: prosecutor.id,
            prosecutorId: prosecutor.id,
            courtId: prosecutor.institution?.defaultCourtId,
          } as CreateCaseDto,
          transaction,
        )

        await this.defendantService.create(caseId, {}, transaction)

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async update(
    caseId: string,
    update: UpdateCaseDto,
    returnUpdatedCase = true,
    transaction?: Transaction,
  ): Promise<Case | undefined> {
    const promisedUpdate = transaction
      ? this.caseModel.update(update, {
          where: { id: caseId },
          transaction,
        })
      : this.caseModel.update(update, {
          where: { id: caseId },
        })

    const [numberOfAffectedRows] = await promisedUpdate

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(`Could not update case ${caseId}`)
    }

    if (returnUpdatedCase) {
      return this.findById(caseId)
    }
  }

  async getRequestPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getRequestPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCourtRecordPdf(theCase: Case, user: TUser): Promise<Buffer> {
    try {
      return await this.awsS3Service.getObject(
        `generated/${theCase.id}/courtRecord.pdf`,
      )
    } catch (error) {
      this.logger.info(
        `The court record for case ${theCase.id} was not found in AWS S3`,
        { error },
      )
    }

    await this.refreshFormatMessage()

    return getCourtRecordPdfAsBuffer(theCase, this.formatMessage, user)
  }

  async getRulingPdf(theCase: Case, useSigned = true): Promise<Buffer> {
    if (useSigned) {
      try {
        return await this.awsS3Service.getObject(
          `generated/${theCase.id}/ruling.pdf`,
        )
      } catch (error) {
        this.logger.info(
          `The ruling for case ${theCase.id} was not found in AWS S3`,
          { error },
        )
      }
    }

    await this.refreshFormatMessage()

    return getRulingPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCustodyPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getCustodyNoticePdfAsBuffer(theCase, this.formatMessage)
  }

  async requestCourtRecordSignature(
    theCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        user.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        user.name ?? '',
        'Ísland',
        'courtRecord.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a court record signature',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getCourtRecordSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestCourtRecordSignature

    try {
      const courtRecordPdf = await this.signingService.waitForSignature(
        'courtRecord.pdf',
        documentToken,
      )

      this.awsS3Service
        .putObject(`generated/${theCase.id}/courtRecord.pdf`, courtRecordPdf)
        .catch((reason) => {
          // Tolerate failure, but log error
          this.logger.error(
            `Failed to upload signed court record pdf to AWS S3 for case ${theCase.id}`,
            { reason },
          )
        })
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to get a court record signature confirmation',
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error as Error,
      )

      if (error instanceof DokobitError) {
        return {
          documentSigned: false,
          code: error.code,
          message: error.message,
        }
      }

      throw error
    }

    // TODO: UpdateCaseDto does not contain courtRecordSignatoryId and courtRecordSignatureDate - create a new type for CaseService.update
    await this.update(
      theCase.id,
      {
        courtRecordSignatoryId: user.id,
        courtRecordSignatureDate: nowFactory(),
      } as UpdateCaseDto,
      false,
    )

    return { documentSigned: true }
  }

  async requestRulingSignature(theCase: Case): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getRulingPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        theCase.judge?.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        theCase.judge?.name ?? '',
        'Ísland',
        'ruling.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a ruling signature',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: theCase.judge?.name,
            institution: theCase.judge?.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getRulingSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature

    return this.signingService
      .waitForSignature('ruling.pdf', documentToken)
      .then(async (signedPdf) => {
        // TODO: UpdateCaseDto does not contain rulingDate - create a new type for CaseService.update
        const newRulingDate = nowFactory()

        return this.update(
          theCase.id,
          {
            rulingDate: newRulingDate,
            ...(!theCase.rulingDate
              ? {}
              : {
                  rulingModifiedHistory: formatRulingModifiedHistory(
                    theCase.rulingModifiedHistory,
                    newRulingDate,
                    theCase.judge?.name,
                    theCase.judge?.title,
                  ),
                }),
          } as UpdateCaseDto,
          false,
        )
          .then(() => ({ documentSigned: true }))
          .finally(() => {
            // No need to wait for this to complete
            this.uploadSignedRulingPdf(theCase, user, signedPdf).finally(() => {
              this.queueService.add({
                type: MessageType.RULING_SIGNED,
                caseId: theCase.id,
              })
            })
          })
      })
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to get a ruling signature confirmation',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error as Error,
        )

        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      })
  }

  async extend(theCase: Case, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            origin: theCase.origin,
            type: theCase.type,
            description: theCase.description,
            policeCaseNumbers: theCase.policeCaseNumbers,
            defenderName: theCase.defenderName,
            defenderNationalId: theCase.defenderNationalId,
            defenderEmail: theCase.defenderEmail,
            defenderPhoneNumber: theCase.defenderPhoneNumber,
            leadInvestigator: theCase.leadInvestigator,
            courtId: theCase.courtId,
            translator: theCase.translator,
            lawsBroken: theCase.lawsBroken,
            legalBasis: theCase.legalBasis,
            legalProvisions: theCase.legalProvisions,
            requestedCustodyRestrictions: theCase.requestedCustodyRestrictions,
            caseFacts: theCase.caseFacts,
            legalArguments: theCase.legalArguments,
            requestProsecutorOnlySession: theCase.requestProsecutorOnlySession,
            prosecutorOnlySessionRequest: theCase.prosecutorOnlySessionRequest,
            parentCaseId: theCase.id,
            initialRulingDate: theCase.initialRulingDate ?? theCase.rulingDate,
            creatingProsecutorId: user.id,
            prosecutorId: user.id,
          } as CreateCaseDto,
          transaction,
        )

        if (theCase.defendants && theCase.defendants?.length > 0) {
          await Promise.all(
            theCase.defendants?.map((defendant) =>
              this.defendantService.create(
                caseId,
                {
                  noNationalId: defendant.noNationalId,
                  nationalId: defendant.nationalId,
                  name: defendant.name,
                  gender: defendant.gender,
                  address: defendant.address,
                  citizenship: defendant.citizenship,
                },
                transaction,
              ),
            ),
          )
        }

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async uploadRequestPdfToCourt(theCase: Case, user: TUser): Promise<void> {
    try {
      await this.refreshFormatMessage()

      const pdf = await getRequestPdfAsBuffer(theCase, this.formatMessage)

      await this.courtService.createRequest(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        `Krafa ${theCase.policeCaseNumbers.join(', ')}`,
        pdf,
      )
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to upload request pdf to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  async createCourtCase(theCase: Case, user: TUser): Promise<Case> {
    const courtCaseNumber = await this.courtService.createCourtCase(
      user,
      theCase.id,
      theCase.courtId ?? '',
      theCase.type,
      theCase.policeCaseNumbers,
      Boolean(theCase.parentCaseId),
    )

    const updatedCase = (await this.update(
      theCase.id,
      { courtCaseNumber },
      true,
    )) as Case

    // No need to wait
    this.uploadRequestPdfToCourt(updatedCase, user)

    return updatedCase
  }

  async archive(): Promise<ArchiveResponse> {
    const theCase = await this.caseModel.findOne({
      include: [...includes, { model: CaseFile, as: 'caseFiles' }],
      order: [
        defendantsOrder,
        [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
      ],
      where: {
        isArchived: false,
        [Op.or]: [{ state: CaseState.DELETED }, oldFilter],
      },
    })

    if (!theCase) {
      return { caseArchived: false }
    }

    await this.sequelize.transaction(async (transaction) => {
      const [clearedCaseProperties, caseArchive] = collectEncryptionProperties(
        caseEncryptionProperties,
        theCase,
      )

      const defendantsArchive = []
      for (const defendant of theCase.defendants ?? []) {
        const [
          clearedDefendantProperties,
          defendantArchive,
        ] = collectEncryptionProperties(
          defendantEncryptionProperties,
          defendant,
        )
        defendantsArchive.push(defendantArchive)

        await this.defendantService.update(
          theCase.id,
          defendant.id,
          clearedDefendantProperties,
          transaction,
        )
      }

      const caseFilesArchive = []
      for (const caseFile of theCase.caseFiles ?? []) {
        const [
          clearedCaseFileProperties,
          caseFileArchive,
        ] = collectEncryptionProperties(caseFileEncryptionProperties, caseFile)
        caseFilesArchive.push(caseFileArchive)

        await this.fileService.updateCaseFile(
          theCase.id,
          caseFile.id,
          clearedCaseFileProperties,
          transaction,
        )
      }

      await this.caseArchiveModel.create(
        {
          caseId: theCase.id,
          archive: CryptoJS.AES.encrypt(
            JSON.stringify({
              ...caseArchive,
              defendants: defendantsArchive,
              caseFiles: caseFilesArchive,
            }),
            this.config.archiveEncryptionKey,
            { iv: CryptoJS.enc.Hex.parse(uuidFactory()) },
          ).toString(),
        },
        { transaction },
      )

      await this.update(
        theCase.id,
        { ...clearedCaseProperties, isArchived: true } as UpdateCaseDto,
        false,
        transaction,
      )
    })

    this.eventService.postEvent(CaseEvent.ARCHIVE, theCase)

    return { caseArchived: true }
  }

  async deliver(theCase: Case): Promise<DeliverResponse> {
    this.refreshFormatMessage()

    const signedRulingDeliveredToCourt = await this.deliverSignedRulingToCourt(
      theCase,
    )

    const courtRecordDeliveredToCourt =
      Boolean(theCase.rulingModifiedHistory) || // court record did not change
      (await this.deliverCourtRecordToCourt(theCase))

    const caseFilesDeliveredToCourt =
      Boolean(theCase.rulingModifiedHistory) || // case files did not change
      (await this.deliverCaseFilesToCourt(theCase))

    const caseDeliveredToPolice =
      Boolean(theCase.rulingModifiedHistory) || // no relevant changes
      (theCase.origin === CaseOrigin.LOKE &&
        (await this.deliverCaseToPolice(theCase)))

    if (!signedRulingDeliveredToCourt || !courtRecordDeliveredToCourt) {
      this.sendEmailToCourt(
        theCase,
        this.formatMessage(m.signedRuling.subjectV2, {
          courtCaseNumber: theCase.courtCaseNumber,
          isModifyingRuling: Boolean(theCase.rulingDate),
        }),
        this.formatMessage(m.signedRuling.courtBody, {
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
          linkEnd: '</a>',
        }),
      )
    }

    return {
      signedRulingDeliveredToCourt,
      courtRecordDeliveredToCourt,
      caseFilesDeliveredToCourt,
      caseDeliveredToPolice,
    }
  }
}
