import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { CaseState } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { User } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, Notification, NotificationType } from './models'
import { getPdf } from './case.pdf'
import { writeDummySignedPdf } from './case.dummy.pdf'

@Injectable()
export class CaseService {
  constructor(
    private readonly smsService: SmsService,
    private readonly signingService: SigningService,
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['modified', 'DESC']],
      include: [Notification],
    })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case with id "${id}"`)

    return this.caseModel.findOne({
      where: { id },
      include: [Notification],
    })
  }

  create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug(`Creating case ${caseToCreate}`)

    return this.caseModel.create(caseToCreate)
  }

  async update(
    id: string,
    caseToUpdate: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case whith id "${id}"`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      caseToUpdate,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  async transition(
    id: string,
    modified: Date,
    state: CaseState,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Transitioning case with id "${id}"`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      { state },
      {
        where: {
          id,
          modified,
        },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  getAllNotificationsByCaseId(existingCase: Case): Promise<Notification[]> {
    this.logger.debug(
      `Getting all notifications for case with id "${existingCase.id}"`,
    )

    return this.notificationModel.findAll({
      where: { caseId: existingCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendNotificationByCaseId(
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
    this.logger.debug(
      `Sending a notification for case with id "${existingCase.id}"`,
    )

    // This method should only be called if the case state is DRAFT or SUBMITTED

    const smsText =
      existingCase.state === CaseState.DRAFT
        ? this.constructHeadsUpSmsText(existingCase, user)
        : // State is CaseState.SUBMITTED
          this.constructReadyForCourtpSmsText(existingCase, user)

    // Production or local development with judge mobile number
    if (environment.production || environment.notifications.judgeMobileNumber) {
      await this.smsService.sendSms(
        environment.notifications.judgeMobileNumber,
        smsText,
      )
    }

    return this.notificationModel.create({
      caseId: existingCase.id,
      type:
        existingCase.state === CaseState.DRAFT
          ? NotificationType.HEADS_UP
          : // State is CaseState.SUBMITTED
            NotificationType.READY_FOR_COURT,
      message: smsText,
    })
  }

  async requestSignature(
    existingCase: Case,
    user: User,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case with id "${existingCase.id}"`,
    )

    // This method should only be called if the csae state is ACCEPTED or REJECTED

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      const pdf = await this.getRulingAsPdf()

      return this.signingService.requestSignature(
        user.mobileNumber,
        'Undirrita dóm',
        existingCase.accusedName,
        'Ísland',
        'ruling.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPEMNT',
    }
  }

  async confirrmSignature(
    existingCase: Case,
    documentToken: string,
  ): Promise<Case> {
    this.logger.debug(
      `Confirming signature of ruling for case with id "${existingCase.id}"`,
    )

    // This method should only be called if the csae state is ACCEPTED or REJECTED and
    // requestSignature has previously been called for the same case

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      const signedPdf = await this.signingService.getSignedDocument(
        'ruling.pdf',
        documentToken,
      )

      this.sendRulingAsSignedPdf(signedPdf)
    }

    return existingCase
  }

  private constructHeadsUpSmsText(existingCase: Case, user: User): string {
    // Prosecutor
    const prosecutor = user ? ` Ákærandi: ${user.name}.` : ''

    // Arrest date
    const ad = existingCase.arrestDate?.toISOString()
    const adText = ad
      ? ` Viðkomandi handtekinn ${ad.substring(8, 10)}.${ad.substring(
          5,
          7,
        )}.${ad.substring(0, 4)} kl. ${ad.substring(11, 13)}:${ad.substring(
          14,
          16,
        )}.`
      : ''

    // Court date
    const cd = existingCase.requestedCourtDate?.toISOString()
    const cdText = cd
      ? ` ÓE fyrirtöku ${cd.substring(8, 10)}.${cd.substring(
          5,
          7,
        )}.${cd.substring(0, 4)} eftir kl. ${cd.substring(
          11,
          13,
        )}:${cd.substring(14, 16)}.`
      : ''

    return `Ný gæsluvarðhaldskrafa í vinnslu.${prosecutor}${adText}${cdText}`
  }

  private constructReadyForCourtpSmsText(
    existingCase: Case,
    user: User,
  ): string {
    // Prosecutor
    const prosecutor = user ? ` Ákærandi: ${user.name}.` : ''

    // Court
    const court = existingCase.court ? ` Dómstóll: ${existingCase.court}.` : ''

    return `Gæsluvarðhaldskrafa tilbúin til afgreiðslu.${prosecutor}${court}`
  }

  // Not implemented yet
  private getRulingAsPdf(): Promise<string> {
    return getPdf()
  }

  // Not implemented yet
  private sendRulingAsSignedPdf(
    signedPdf: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): void {
    writeDummySignedPdf(signedPdf)
  }
}
