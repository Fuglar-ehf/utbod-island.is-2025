import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ICalendar } from 'datebook'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  NotificationType,
  isRestrictionCase,
  isInvestigationCase,
  SessionArrangements,
  User,
} from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'
import {
  formatProsecutorCourtDateEmailNotification,
  formatCourtHeadsUpSmsNotification,
  formatPrisonCourtDateEmailNotification,
  formatCourtReadyForCourtSmsNotification,
  getRequestPdfAsString,
  formatDefenderCourtDateEmailNotification,
  stripHtmlTags,
  formatPrisonRulingEmailNotification,
  formatCourtRevokedSmsNotification,
  formatPrisonRevokedEmailNotification,
  formatDefenderRevokedEmailNotification,
  getRequestPdfAsBuffer,
  getCustodyNoticePdfAsString,
  formatProsecutorReceivedByCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
  getCourtRecordPdfAsString,
} from '../../formatters'
import { notifications, core } from '../../messages'
import { Case } from '../case'
import { CourtService } from '../court'
import { CaseEvent, EventService } from '../event'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.resopnse'

interface Recipient {
  address?: string
  success: boolean
}

interface Attachment {
  filename: string
  content: string
  encoding?: string
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    private readonly courtService: CourtService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    private readonly intlService: IntlService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
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

  private async existsRevokableNotification(
    caseId: string,
    recipientAddress?: string,
  ): Promise<boolean> {
    try {
      const notifications: Notification[] = await this.notificationModel.findAll(
        {
          where: {
            caseId,
            type: [
              NotificationType.HEADS_UP,
              NotificationType.READY_FOR_COURT,
              NotificationType.COURT_DATE,
            ],
          },
        },
      )

      return notifications.some((notification) => {
        if (!notification.recipients) {
          return false
        }

        const recipients: Recipient[] = JSON.parse(notification.recipients)

        return recipients.some(
          (recipient) =>
            recipient.address === recipientAddress && recipient.success,
        )
      })
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Error while looking up revokable notifications for case ${caseId}`,
        { error },
      )

      return false
    }
  }

  private getCourtMobileNumbers(courtId?: string) {
    return (
      (courtId && environment.notifications.courtsMobileNumbers[courtId]) ??
      undefined
    )
  }

  private async sendSms(
    smsText: string,
    mobileNumbers?: string,
  ): Promise<Recipient> {
    // Production or local development with judge mobile number
    if (environment.production || mobileNumbers) {
      try {
        await this.smsService.sendSms(mobileNumbers?.split(',') ?? '', smsText)
      } catch (error) {
        this.logger.error('Failed to send sms to court mobile numbers', {
          error,
        })

        return {
          address: mobileNumbers,
          success: false,
        }
      }
    }

    return {
      address: mobileNumbers,
      success: true,
    }
  }

  private async sendEmail(
    subject: string,
    html: string,
    recipientName?: string,
    recipientEmail?: string,
    attachments?: Attachment[],
  ): Promise<Recipient> {
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
            name: recipientName ?? '',
            address: recipientEmail ?? '',
          },
        ],
        subject: subject,
        text: stripHtmlTags(html),
        html: html,
        attachments: attachments,
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })

      return {
        address: recipientEmail,
        success: false,
      }
    }

    return {
      address: recipientEmail,
      success: true,
    }
  }

  private async recordNotification(
    caseId: string,
    type: NotificationType,
    recipients: Recipient[],
  ): Promise<SendNotificationResponse> {
    const notification = await this.notificationModel.create({
      caseId,
      type,
      recipients: JSON.stringify(recipients),
    })

    return {
      notificationSent: recipients.reduce(
        (sent, recipient) => sent || recipient?.success,
        false as boolean,
      ),
      notification,
    }
  }

  private async uploadRequestPdfToCourt(theCase: Case): Promise<void> {
    const requestPdf = await getRequestPdfAsBuffer(theCase, this.formatMessage)

    try {
      await this.courtService.createRequest(
        theCase.courtId,
        theCase.courtCaseNumber,
        requestPdf,
      )
    } catch (error) {
      this.logger.error('Failed to upload request pdf to court', { error })
    }
  }

  private createICalAttachment(theCase: Case): Attachment | undefined {
    if (theCase.courtDate) {
      const eventOrganizer = {
        name: theCase.registrar
          ? theCase.registrar.name
          : theCase.judge
          ? theCase.judge.name
          : '',
        email: theCase.registrar
          ? theCase.registrar.email
          : theCase.judge
          ? theCase.judge.email
          : '',
      }

      const courtDate = new Date(theCase.courtDate.toString().split('.')[0])
      const courtEnd = new Date(theCase.courtDate.getTime() + 30 * 60000)

      const icalendar = new ICalendar({
        title: `Fyrirtaka í máli ${theCase.courtCaseNumber} - ${theCase.prosecutor?.institution?.name} gegn X`,
        location: `${theCase.court?.name} - ${
          theCase.courtRoom
            ? `Dómsalur ${theCase.courtRoom}`
            : 'Dómsalur hefur ekki verið skráður.'
        }`,
        start: courtDate,
        end: courtEnd,
      })

      return {
        filename: 'court-date.ics',
        content: icalendar
          .addProperty(
            `ORGANIZER;CN=${eventOrganizer.name}`,
            `MAILTO:${eventOrganizer.email}`,
          )
          .render(),
      }
    }
  }

  /* HEADS_UP notifications */

  private sendHeadsUpSmsNotificationToCourt(theCase: Case): Promise<Recipient> {
    const smsText = formatCourtHeadsUpSmsNotification(
      theCase.type,
      theCase.prosecutor?.name,
      theCase.arrestDate,
      theCase.requestedCourtDate,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private async sendHeadsUpNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendHeadsUpSmsNotificationToCourt(theCase)

    return this.recordNotification(theCase.id, NotificationType.HEADS_UP, [
      recipient,
    ])
  }

  /* READY_FOR_COURT notifications */

  private sendReadyForCourtSmsNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtReadyForCourtSmsNotification(
      theCase.type,
      theCase.prosecutor?.name,
      theCase.court?.name,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private sendResubmittedToCourtSmsNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtResubmittedToCourtSmsNotification(
      theCase.courtCaseNumber,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private async sendReadyForCourtEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const { type, court, policeCaseNumber } = theCase

    const subject = `Krafa í máli ${policeCaseNumber}`

    const caseType =
      type === CaseType.CUSTODY
        ? this.formatMessage(core.caseType.custody)
        : type === CaseType.TRAVEL_BAN
        ? this.formatMessage(core.caseType.travelBan)
        : this.formatMessage(core.caseType.investigate)

    const html = this.formatMessage(
      notifications.readyForCourt.prosecutorHtml,
      {
        caseType,
        courtName: court?.name,
        policeCaseNumber,
        linkStart: `<a href="${
          isRestrictionCase(theCase.type)
            ? environment.deepLinks.prosecutorRestrictionCaseOverviewUrl
            : environment.deepLinks.prosecutorInvestigationCaseOverviewUrl
        }${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    return this.sendEmail(
      subject,
      html,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
    )
  }

  private async sendReadyForCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    // TODO: Ignore failed notifications
    const notification = await this.notificationModel.findOne({
      where: {
        caseId: theCase.id,
        type: NotificationType.READY_FOR_COURT,
      },
    })

    const promises: Promise<Recipient>[] = [
      this.sendReadyForCourtEmailNotificationToProsecutor(theCase),
    ]

    // TODO: Find a better place for this
    if (
      theCase.courtId &&
      IntegratedCourts.includes(theCase.courtId) &&
      theCase.courtCaseNumber
    ) {
      // No need to wait
      this.uploadRequestPdfToCourt(theCase)
    }

    if (notification) {
      if (theCase.courtCaseNumber) {
        promises.push(
          this.sendResubmittedToCourtSmsNotificationToCourt(theCase),
        )
      }

      this.eventService.postEvent(CaseEvent.RESUBMIT, theCase)
    } else {
      promises.push(this.sendReadyForCourtSmsNotificationToCourt(theCase))
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.READY_FOR_COURT,
      recipients,
    )
  }

  /* RECEIVED_BY_COURT notifications */

  private sendReceivedByCourtSmsNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatProsecutorReceivedByCourtSmsNotification(
      theCase.type,
      theCase.court?.name,
      theCase.courtCaseNumber,
    )

    return this.sendSms(smsText, theCase.prosecutor?.mobileNumber)
  }

  private async sendReceivedByCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendReceivedByCourtSmsNotificationToProsecutor(
      theCase,
    )

    return this.recordNotification(
      theCase.id,
      NotificationType.RECEIVED_BY_COURT,
      [recipient],
    )
  }

  /* COURT_DATE notifications */

  private sendCourtDateEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = `Fyrirtaka í máli ${theCase.policeCaseNumber}`
    const html = formatProsecutorCourtDateEmailNotification(
      theCase.type,
      theCase.court?.name,
      theCase.courtDate,
      theCase.courtRoom,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.defenderName,
      theCase.defenderIsSpokesperson,
      theCase.sessionArrangements,
    )
    const calendarInvite = this.createICalAttachment(theCase)

    return this.sendEmail(
      subject,
      html,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
      calendarInvite ? [calendarInvite] : undefined,
    )
  }

  private sendCourtDateEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = 'Krafa um gæsluvarðhald í vinnslu' // Always custody
    // Assume there is at most one defendant
    const html = formatPrisonCourtDateEmailNotification(
      theCase.creatingProsecutor?.institution?.name,
      theCase.court?.name,
      theCase.courtDate,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].name
        : undefined,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].gender
        : undefined,
      theCase.requestedValidToDate,
      theCase.requestedCustodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      ),
      theCase.defenderName,
      theCase.defenderIsSpokesperson,
      Boolean(theCase.parentCase),
    )

    return this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
    )
  }

  private async sendCourtDateEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = `Fyrirtaka í máli ${theCase.courtCaseNumber}`
    const html = formatDefenderCourtDateEmailNotification(
      theCase.court?.name,
      theCase.courtCaseNumber,
      theCase.courtDate,
      theCase.courtRoom,
      theCase.defenderIsSpokesperson,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.prosecutor?.name,
      theCase.prosecutor?.institution?.name,
    )
    const calendarInvite = this.createICalAttachment(theCase)
    const attachments: Attachment[] = calendarInvite ? [calendarInvite] : []

    if (theCase.sendRequestToDefender) {
      const pdf = await getRequestPdfAsString(theCase, this.formatMessage)

      attachments.push({
        filename: `${theCase.policeCaseNumber}.pdf`,
        content: pdf,
        encoding: 'binary',
      })
    }

    return this.sendEmail(
      subject,
      html,
      theCase.defenderName,
      theCase.defenderEmail,
      attachments,
    )
  }

  private async sendCourtDateNotifications(
    theCase: Case,
    eventOnly?: boolean,
  ): Promise<SendNotificationResponse> {
    this.eventService.postEvent(CaseEvent.SCHEDULE_COURT_DATE, theCase)

    if (eventOnly) {
      return { notificationSent: false }
    }

    const promises: Promise<Recipient>[] = [
      this.sendCourtDateEmailNotificationToProsecutor(theCase),
    ]

    if (
      (isRestrictionCase(theCase.type) ||
        theCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
        (theCase.sessionArrangements ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON &&
          theCase.defenderIsSpokesperson)) &&
      theCase.defenderEmail
    ) {
      promises.push(this.sendCourtDateEmailNotificationToDefender(theCase))
    }

    if (theCase.type === CaseType.CUSTODY) {
      promises.push(this.sendCourtDateEmailNotificationToPrison(theCase))
    }

    const recipients = await Promise.all(promises)

    const result = await this.recordNotification(
      theCase.id,
      NotificationType.COURT_DATE,
      recipients,
    )

    return result
  }

  /* RULING notifications */

  private async sendRulingEmailNotificationToPrison(
    theCase: Case,
    courtRecordPdf: string,
  ): Promise<Recipient> {
    const subject = 'Úrskurður um gæsluvarðhald' // Always custody
    const html = formatPrisonRulingEmailNotification(theCase.rulingDate)
    const custodyNoticePdf = await getCustodyNoticePdfAsString(
      theCase,
      this.formatMessage,
    )

    const attachments = [
      {
        filename: `Vistunarseðill ${theCase.courtCaseNumber}.pdf`,
        content: custodyNoticePdf,
        encoding: 'binary',
      },
      {
        filename: this.formatMessage(
          notifications.signedRuling.courtRecordAttachment,
          { courtCaseNumber: theCase.courtCaseNumber },
        ),
        content: courtRecordPdf,
        encoding: 'binary',
      },
    ]

    return this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      attachments,
    )
  }

  private async sendRulingEmailNotificationToPrisonAdministration(
    theCase: Case,
    courtRecordPdf: string,
  ): Promise<Recipient> {
    return this.sendEmail(
      theCase.courtCaseNumber ?? '',
      'Sjá viðhengi',
      'Fangelsismálastofnun',
      environment.notifications.prisonAdminEmail,
      [
        {
          filename: this.formatMessage(
            notifications.signedRuling.courtRecordAttachment,
            { courtCaseNumber: theCase.courtCaseNumber },
          ),
          content: courtRecordPdf,
          encoding: 'binary',
        },
      ],
    )
  }

  private async sendRulingNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    if (isInvestigationCase(theCase.type)) {
      return {
        notificationSent: false,
      }
    }

    const courtRecordPdf = await getCourtRecordPdfAsString(
      theCase,
      this.formatMessage,
    )

    const recipients = [
      await this.sendRulingEmailNotificationToPrisonAdministration(
        theCase,
        courtRecordPdf,
      ),
    ]

    if (
      theCase.type === CaseType.CUSTODY &&
      (theCase.decision === CaseDecision.ACCEPTING ||
        theCase.decision === CaseDecision.ACCEPTING_PARTIALLY)
    ) {
      recipients.concat(
        await this.sendRulingEmailNotificationToPrison(theCase, courtRecordPdf),
      )
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.RULING,
      recipients,
    )
  }

  /* MODIFIED notifications */

  private async sendModifiedNotifications(
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const subject = this.formatMessage(notifications.modified.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })
    const html = `${
      theCase.isCustodyIsolation
        ? this.formatMessage(notifications.modified.isolationHtml, {
            actorInstitution: user.institution?.name,
            actorName: user.name,
            actorTitle: user.title,
            courtCaseNumber: theCase.courtCaseNumber,
            linkStart: `<a href="${environment.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
            linkEnd: '</a>',
            validToDate: formatDate(theCase.validToDate, 'PPPp'),
            isolationToDate: formatDate(theCase.isolationToDate, 'PPPp'),
          })
        : this.formatMessage(notifications.modified.html, {
            actorInstitution: user.institution?.name,
            actorName: user.name,
            actorTitle: user.title,
            courtCaseNumber: theCase.courtCaseNumber,
            linkStart: `<a href="${environment.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
            linkEnd: '</a>',
            validToDate: formatDate(theCase.validToDate, 'PPPp'),
          })
    }`

    const recipients = [
      await this.sendEmail(
        subject,
        html,
        'Fangelsismálastofnun',
        environment.notifications.prisonAdminEmail,
      ),
      await this.sendEmail(
        subject,
        html,
        'Gæsluvarðhaldsfangelsi',
        environment.notifications.prisonEmail,
      ),
    ]

    if (user.id !== theCase.prosecutorId) {
      recipients.push(
        await this.sendEmail(
          subject,
          html,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    if (user.id !== theCase.judgeId) {
      recipients.push(
        await this.sendEmail(
          subject,
          html,
          theCase.judge?.name,
          theCase.judge?.email,
        ),
      )
    }

    if (theCase.registrar && user.id !== theCase.registrarId) {
      recipients.push(
        await this.sendEmail(
          subject,
          html,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
      )
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.MODIFIED,
      recipients,
    )
  }

  /* REVOKED notifications */

  private sendRevokedSmsNotificationToCourt(theCase: Case): Promise<Recipient> {
    const smsText = formatCourtRevokedSmsNotification(
      theCase.type,
      theCase.prosecutor?.name,
      theCase.requestedCourtDate,
      theCase.courtDate,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private sendRevokedEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = 'Gæsluvarðhaldskrafa afturkölluð' // Always custody
    // Assume there is at most one defendant
    const html = formatPrisonRevokedEmailNotification(
      theCase.creatingProsecutor?.institution?.name,
      theCase.court?.name,
      theCase.courtDate,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].name
        : undefined,
      theCase.defenderName,
      Boolean(theCase.parentCase),
    )

    return this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
    )
  }

  private sendRevokedEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const caseType =
      theCase.type === CaseType.CUSTODY
        ? this.formatMessage(core.caseType.custody)
        : theCase.type === CaseType.TRAVEL_BAN
        ? this.formatMessage(core.caseType.travelBan)
        : this.formatMessage(core.caseType.investigate)

    const subject = `Krafa um ${caseType} afturkölluð`

    // Assume there is at most one defendant
    const html = formatDefenderRevokedEmailNotification(
      theCase.type,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].nationalId
        : undefined,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].name
        : undefined,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].noNationalId
        : undefined,
      theCase.court?.name,
      theCase.courtDate,
    )

    return this.sendEmail(
      subject,
      html,
      theCase.defenderName,
      theCase.defenderEmail,
    )
  }

  private async sendRevokedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    const courtWasNotified = await this.existsRevokableNotification(
      theCase.id,
      this.getCourtMobileNumbers(theCase.courtId),
    )

    if (courtWasNotified) {
      promises.push(this.sendRevokedSmsNotificationToCourt(theCase))
    }

    const prisonWasNotified =
      theCase.type === CaseType.CUSTODY &&
      (await this.existsRevokableNotification(
        theCase.id,
        environment.notifications.prisonEmail,
      ))

    if (prisonWasNotified) {
      promises.push(this.sendRevokedEmailNotificationToPrison(theCase))
    }

    const defenderWasNotified = await this.existsRevokableNotification(
      theCase.id,
      theCase.defenderEmail,
    )

    if (defenderWasNotified && theCase.defenderEmail) {
      promises.push(this.sendRevokedEmailNotificationToDefender(theCase))
    }

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        NotificationType.REVOKED,
        recipients,
      )
    }

    return {
      notificationSent: false,
    }
  }

  /* API */

  async getAllCaseNotifications(theCase: Case): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { caseId: theCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendCaseNotification(
    notification: SendNotificationDto,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    await this.refreshFormatMessage()

    switch (notification.type) {
      case NotificationType.HEADS_UP:
        return this.sendHeadsUpNotifications(theCase)
      case NotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotifications(theCase)
      case NotificationType.RECEIVED_BY_COURT:
        return this.sendReceivedByCourtNotifications(theCase)
      case NotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(theCase, notification.eventOnly)
      case NotificationType.RULING:
        return this.sendRulingNotifications(theCase)
      case NotificationType.MODIFIED:
        return this.sendModifiedNotifications(theCase, user)
      case NotificationType.REVOKED:
        return this.sendRevokedNotifications(theCase)
    }
  }
}
