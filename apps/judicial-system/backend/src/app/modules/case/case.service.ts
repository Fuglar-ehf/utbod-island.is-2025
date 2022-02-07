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

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import {
  isRestrictionCase,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
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
} from '../../formatters'
import { notifications as m } from '../../messages'
import { FileService } from '../file/file.service'
import { DefendantService } from '../defendant/defendant.service'
import { Defendant } from '../defendant/models/defendant.model'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CreateCaseDto, InternalCreateCaseDto, UpdateCaseDto } from './dto'
import { getCasesQueryFilter } from './filters'
import { Case, SignatureConfirmationResponse } from './models'

interface Recipient {
  name: string
  address: string
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
  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    private readonly defendantService: DefendantService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    intlService: IntlService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => (this.formatMessage = res.formatMessage))
  }

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
    pdf: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Uploading signed ruling pdf to court for case ${theCase.id}`,
    )

    if (!environment.production) {
      writeFile(`${theCase.id}-ruling-signed.pdf`, pdf)
    }

    const buffer = Buffer.from(pdf, 'binary')

    try {
      const streamId = await this.courtService.uploadStream(
        theCase.courtId,
        'Úrskurður.pdf',
        'application/pdf',
        buffer,
      )
      await this.courtService.createRuling(
        theCase.courtId,
        theCase.courtCaseNumber,
        streamId,
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

  private async uploadCourtRecordPdfToCourt(theCase: Case, pdf: string) {
    try {
      this.logger.debug(
        `Uploading court record pdf to court for case ${theCase.id}`,
      )
      if (!environment.production) {
        writeFile(`${theCase.id}-court-record.pdf`, pdf)
      }

      const buffer = Buffer.from(pdf, 'binary')

      const streamId = await this.courtService.uploadStream(
        theCase.courtId,
        'Þingbók.pdf',
        'application/pdf',
        buffer,
      )
      await this.courtService.createThingbok(
        theCase.courtId,
        theCase.courtCaseNumber,
        streamId,
      )
    } catch (error) {
      // Log and ignore this error. The court record can be uploaded manually.
      this.logger.error(
        `Failed to upload court record pdf to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private async uploadCaseFilesPdfToCourt(theCase: Case) {
    try {
      theCase.caseFiles = await this.fileService.getAllCaseFiles(theCase.id)

      if (theCase.caseFiles && theCase.caseFiles.length > 0) {
        this.logger.debug(
          `Uploading case files overview pdf to court for case ${theCase.id}`,
        )

        const caseFilesPdf = await getCasefilesPdfAsString(theCase)

        if (!environment.production) {
          writeFile(`${theCase.id}-case-files.pdf`, caseFilesPdf)
        }

        const buffer = Buffer.from(caseFilesPdf, 'binary')

        const streamId = await this.courtService.uploadStream(
          theCase.courtId,
          'Rannsóknargögn.pdf',
          'application/pdf',
          buffer,
        )
        await this.courtService.createDocument(
          theCase.courtId,
          theCase.courtCaseNumber,
          'Rannsóknargögn',
          'Rannsóknargögn.pdf',
          streamId,
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

  private async sendEmail(
    to: Recipient | Recipient[],
    body: string,
    courtCaseNumber?: string,
    attachments?: Attachment[],
  ) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: environment.email.fromName,
          address: environment.email.fromEmail,
        },
        replyTo: {
          name: environment.email.replyToName,
          address: environment.email.replyToEmail,
        },
        to,
        subject: this.formatMessage(m.signedRuling.subject, {
          courtCaseNumber,
        }),
        text: stripHtmlTags(body),
        html: body,
        attachments,
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })
    }
  }

  private async sendRulingAsSignedPdf(
    theCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    let uploadedToS3 = false
    let uploadedToCourt = false

    const uploadPromises = [
      this.uploadSignedRulingPdfToS3(theCase, signedRulingPdf).then((res) => {
        uploadedToS3 = res
      }),
    ]

    let courtRecordPdf = undefined

    if (
      theCase.courtId &&
      theCase.courtCaseNumber &&
      IntegratedCourts.includes(theCase.courtId)
    ) {
      uploadPromises.push(
        this.uploadSignedRulingPdfToCourt(theCase, signedRulingPdf).then(
          (res) => {
            uploadedToCourt = res
          },
        ),
        this.uploadCaseFilesPdfToCourt(theCase),
        getCourtRecordPdfAsString(theCase, this.formatMessage)
          .then((pdf) => {
            courtRecordPdf = pdf
            return this.uploadCourtRecordPdfToCourt(theCase, courtRecordPdf)
          })
          .catch((reason) => {
            // Log and ignore this error. The court record can be uploaded manually.
            this.logger.error(
              `Failed to generate court record pdf for case ${theCase.id}`,
              { reason },
            )
          }),
      )
    }

    await Promise.all(uploadPromises)

    const rulingAttachment = {
      filename: this.formatMessage(m.signedRuling.rulingAttachment, {
        courtCaseNumber: theCase.courtCaseNumber,
      }),
      content: signedRulingPdf,
      encoding: 'binary',
    }

    const emailPromises = [
      this.sendEmail(
        {
          name: theCase.prosecutor?.name ?? '',
          address: theCase.prosecutor?.email ?? '',
        },
        uploadedToS3
          ? this.formatMessage(m.signedRuling.prosecutorBodyS3, {
              courtCaseNumber: theCase.courtCaseNumber,
              courtName: theCase.court?.name?.replace('dómur', 'dómi'),
              linkStart: `<a href="${environment.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
              linkEnd: '</a>',
            })
          : this.formatMessage(m.signedRuling.prosecutorBodyAttachment, {
              courtName: theCase.court?.name,
              courtCaseNumber: theCase.courtCaseNumber,
              linkStart: `<a href="${environment.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
              linkEnd: '</a>',
            }),
        theCase.courtCaseNumber,
        uploadedToS3 ? undefined : [rulingAttachment],
      ),
    ]

    if (!uploadedToCourt) {
      const recipients = [
        {
          name: theCase.judge?.name ?? '',
          address: theCase.judge?.email ?? '',
        },
      ]
      if (theCase.registrar) {
        recipients.push({
          name: theCase.registrar?.name ?? '',
          address: theCase.registrar?.email ?? '',
        })
      }

      emailPromises.push(
        this.sendEmail(
          recipients,
          this.formatMessage(m.signedRuling.courtBodyAttachment),
          theCase.courtCaseNumber,
          [rulingAttachment],
        ),
      )
    }

    if (
      theCase.defenderEmail &&
      (isRestrictionCase(theCase.type) ||
        theCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
        (theCase.sessionArrangements ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON &&
          theCase.defenderIsSpokesperson))
    ) {
      const attachments = courtRecordPdf
        ? [
            {
              filename: this.formatMessage(
                m.signedRuling.courtRecordAttachment,
                {
                  courtCaseNumber: theCase.courtCaseNumber,
                },
              ),
              content: courtRecordPdf,
              encoding: 'binary',
            },
            rulingAttachment,
          ]
        : [rulingAttachment]

      emailPromises.push(
        this.sendEmail(
          {
            name: theCase.defenderName ?? '',
            address: theCase.defenderEmail,
          },
          this.formatMessage(m.signedRuling.defenderBodyAttachment, {
            courtName: theCase.court?.name,
            courtCaseNumber: theCase.courtCaseNumber,
          }),
          theCase.courtCaseNumber,
          attachments,
        ),
      )
    }

    await Promise.all(emailPromises)
  }

  private async createCase(
    caseToCreate: CreateCaseDto,
    prosecutorId?: string,
    transaction?: Transaction,
  ): Promise<string> {
    const theCase = await (transaction
      ? this.caseModel.create(
          {
            ...caseToCreate,
            creatingProsecutorId: prosecutorId,
            prosecutorId,
          },
          { transaction },
        )
      : this.caseModel.create({
          ...caseToCreate,
          creatingProsecutorId: prosecutorId,
          prosecutorId,
        }))

    return theCase.id
  }

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      include: includes,
      order: [defendantsOrder],
      where: { id: caseId },
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
      order: [['created', 'DESC'], defendantsOrder],
      where: getCasesQueryFilter(user),
    })
  }

  async internalCreate(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    let prosecutorId: string | undefined

    if (caseToCreate.prosecutorNationalId) {
      const prosecutor = await this.userService.findByNationalId(
        caseToCreate.prosecutorNationalId,
      )

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        throw new BadRequestException(
          `User ${prosecutor.id} is not registered as a prosecutor`,
        )
      }

      prosecutorId = prosecutor.id
    }

    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          caseToCreate,
          prosecutorId,
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

  async create(
    caseToCreate: CreateCaseDto,
    prosecutorId?: string,
  ): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          caseToCreate,
          prosecutorId,
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
  ): Promise<Case | undefined> {
    const [numberOfAffectedRows] = await this.caseModel.update(update, {
      where: { id: caseId },
    })

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

    return getCourtRecordPdfAsBuffer(theCase, user, this.formatMessage)
  }

  async getRulingPdf(theCase: Case): Promise<Buffer> {
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

    return getRulingPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCustodyPdf(theCase: Case): Promise<Buffer> {
    return getCustodyNoticePdfAsBuffer(theCase, this.formatMessage)
  }

  async requestCourtRecordSignature(
    theCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    // Development without signing service access token
    if (!environment.production && !environment.signingOptions.accessToken) {
      return { controlCode: '0000', documentToken: 'DEVELOPMENT' }
    }

    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)

    return this.signingService.requestSignature(
      user.mobileNumber ?? '',
      'Undirrita skjal - Öryggistala',
      user.name ?? '',
      'Ísland',
      'courtRecord.pdf',
      pdf,
    )
  }

  async getCourtRecordSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestCourtRecordSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const courtRecordPdf = await this.signingService.getSignedDocument(
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
        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain courtRecordSignatoryId and courtRecordSignatureDate - create a new type for CaseService.update
    await this.update(
      theCase.id,
      {
        courtRecordSignatoryId: user.id,
        courtRecordSignatureDate: new Date(),
      } as UpdateCaseDto,
      false,
    )

    return { documentSigned: true }
  }

  async requestRulingSignature(theCase: Case): Promise<SigningServiceResponse> {
    // Development without signing service access token
    if (!environment.production && !environment.signingOptions.accessToken) {
      return { controlCode: '0000', documentToken: 'DEVELOPMENT' }
    }

    const pdf = await getRulingPdfAsString(theCase, this.formatMessage)

    return this.signingService.requestSignature(
      theCase.judge?.mobileNumber ?? '',
      'Undirrita skjal - Öryggistala',
      theCase.judge?.name ?? '',
      'Ísland',
      'ruling.pdf',
      pdf,
    )
  }

  async getRulingSignatureConfirmation(
    theCase: Case,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const signedPdf = await this.signingService.getSignedDocument(
          'ruling.pdf',
          documentToken,
        )

        await this.sendRulingAsSignedPdf(theCase, signedPdf)
      } catch (error) {
        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain rulingDate - create a new type for CaseService.update
    await this.update(
      theCase.id,
      {
        rulingDate: new Date(),
      } as UpdateCaseDto,
      false,
    )

    return {
      documentSigned: true,
    }
  }

  async extend(theCase: Case, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            type: theCase.type,
            description: theCase.description,
            policeCaseNumber: theCase.policeCaseNumber,
            defenderName: theCase.defenderName,
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
          } as CreateCaseDto,
          user.id,
          transaction,
        )

        if (theCase.defendants && theCase.defendants?.length > 0) {
          await Promise.all(
            theCase.defendants?.map((defendant) =>
              this.defendantService.create(
                caseId,
                {
                  nationalId: defendant.nationalId,
                  name: defendant.name,
                  gender: defendant.gender,
                  address: defendant.address,
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

  async uploadRequestPdfToCourt(theCase: Case): Promise<void> {
    this.logger.debug(`Uploading request pdf to court for case ${theCase.id}`)

    const pdf = await getRequestPdfAsBuffer(theCase, this.formatMessage)

    try {
      const streamId = await this.courtService.uploadStream(
        theCase.courtId,
        'Krafa.pdf',
        'application/pdf',
        pdf,
      )
      await this.courtService.createRequest(
        theCase.courtId,
        theCase.courtCaseNumber,
        streamId,
      )
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to upload request pdf to court for case ${theCase.id}`,
        { error },
      )
    }
  }
}
