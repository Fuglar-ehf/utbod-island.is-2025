import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { User as TUser } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  generateRequestPdf,
  generateRulingPdf,
  writeFile,
} from '../../formatters'
import { Institution } from '../institution'
import { User } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { getCasesQueryFilter } from './filters'
import { Case, SignatureConfirmationResponse } from './models'

@Injectable()
export class CaseService {
  constructor(
    @Inject(SigningService)
    private readonly signingService: SigningService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async sendEmail(
    recipientName: string,
    recipientEmail: string,
    courtCaseNumber: string,
    signedRulingPdf: string,
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
        to: [
          {
            name: recipientName,
            address: recipientEmail,
          },
        ],
        subject: `Úrskurður í máli ${courtCaseNumber}`,
        text: 'Sjá viðhengi',
        html: 'Sjá viðhengi',
        attachments: [
          {
            filename: `${courtCaseNumber}.pdf`,
            content: signedRulingPdf,
            encoding: 'binary',
          },
        ],
      })
    } catch (error) {
      this.logger.error(`Failed to send email to ${recipientEmail}`, error)
    }
  }

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

    await Promise.all([
      this.sendEmail(
        existingCase.prosecutor?.name,
        existingCase.prosecutor?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
      this.sendEmail(
        existingCase.registrar?.name,
        existingCase.registrar?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
      this.sendEmail(
        existingCase.judge?.name,
        existingCase.judge?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
      this.sendEmail(
        existingCase.defenderName,
        existingCase.defenderEmail,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
      this.sendEmail(
        'Fangelsismálastofnun',
        environment.notifications.prisonAdminEmail,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
    ])
  }

  getAll(user: TUser): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['created', 'DESC']],
      where: getCasesQueryFilter(user),
      include: [
        {
          model: User,
          as: 'prosecutor',
          include: [{ model: Institution, as: 'institution' }],
        },
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
        { model: Case, as: 'parentCase' },
        { model: Case, as: 'childCase' },
      ],
    })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case ${id}`)

    return this.caseModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'prosecutor',
          include: [{ model: Institution, as: 'institution' }],
        },
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
        { model: Case, as: 'parentCase' },
        { model: Case, as: 'childCase' },
      ],
    })
  }

  create(caseToCreate: CreateCaseDto, user?: TUser): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.caseModel.create({
      ...caseToCreate,
      prosecutorId: user?.id,
    })
  }

  async update(
    id: string,
    update: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case ${id}`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  getRulingPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the ruling for case ${existingCase.id} as a pdf document`,
    )

    return generateRulingPdf(existingCase)
  }

  getRequestPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the request for case ${existingCase.id} as a pdf document`,
    )

    return generateRequestPdf(existingCase)
  }

  async requestSignature(existingCase: Case): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    const pdf = await generateRulingPdf(existingCase)

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      return this.signingService.requestSignature(
        existingCase.judge?.mobileNumber,
        'Undirrita dóm - Öryggistala',
        existingCase.judge?.name,
        'Ísland',
        'ruling.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPMENT',
    }
  }

  async getSignatureConfirmation(
    existingCase: Case,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(
      `Confirming signature of ruling for case ${existingCase.id}`,
    )

    // This method should be called immediately after requestSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const signedPdf = await this.signingService.getSignedDocument(
          'ruling.pdf',
          documentToken,
        )

        await this.sendRulingAsSignedPdf(existingCase, signedPdf)
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

    return {
      documentSigned: true,
    }
  }

  extend(existingCase: Case): Promise<Case> {
    this.logger.debug(`Extending case ${existingCase.id}`)

    return this.caseModel.create({
      type: existingCase.type,
      policeCaseNumber: existingCase.policeCaseNumber,
      accusedNationalId: existingCase.accusedNationalId,
      accusedName: existingCase.accusedName,
      accusedAddress: existingCase.accusedAddress,
      accusedGender: existingCase.accusedGender,
      court: existingCase.court,
      lawsBroken: existingCase.lawsBroken,
      custodyProvisions: existingCase.custodyProvisions,
      requestedCustodyRestrictions: existingCase.requestedCustodyRestrictions,
      caseFacts: existingCase.caseFacts,
      legalArguments: existingCase.legalArguments,
      parentCaseId: existingCase.id,
    })
  }
}
