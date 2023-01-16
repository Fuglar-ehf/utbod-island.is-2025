import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ICalendar } from 'datebook'
import _uniqBy from 'lodash/uniqBy'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  DEFENDER_ROUTE,
  INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
  RESTRICTION_CASE_OVERVIEW_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  NotificationType,
  isRestrictionCase,
  SessionArrangements,
  User,
  isInvestigationCase,
  isIndictmentCase,
  CaseState,
  Recipient,
} from '@island.is/judicial-system/types'
import {
  formatDate,
  formatDefenderRoute,
} from '@island.is/judicial-system/formatters'

import {
  formatProsecutorCourtDateEmailNotification,
  formatCourtHeadsUpSmsNotification,
  formatPrisonCourtDateEmailNotification,
  formatCourtReadyForCourtSmsNotification,
  formatDefenderCourtDateEmailNotification,
  stripHtmlTags,
  formatPrisonRulingEmailNotification,
  formatCourtRevokedSmsNotification,
  formatPrisonRevokedEmailNotification,
  formatDefenderRevokedEmailNotification,
  getCustodyNoticePdfAsString,
  formatProsecutorReceivedByCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
  getCourtRecordPdfAsString,
  formatProsecutorReadyForCourtEmailNotification,
  formatPrisonAdministrationRulingNotification,
  formatDefenderCourtDateLinkEmailNotification,
  formatDefenderResubmittedToCourtEmailNotification,
  formatDefenderAssignedEmailNotification,
} from '../../formatters'
import { notifications } from '../../messages'
import { Case } from '../case'
import { CourtService } from '../court'
import { AwsS3Service } from '../aws-s3'
import { CaseEvent, EventService } from '../event'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.response'
import { notificationModuleConfig } from './notification.config'
import { Defendant, DefendantService } from '../defendant'

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
    @Inject(notificationModuleConfig.KEY)
    private readonly config: ConfigType<typeof notificationModuleConfig>,
    private readonly courtService: CourtService,
    private readonly awsS3Service: AwsS3Service,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    private readonly intlService: IntlService,
    private readonly defendantService: DefendantService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async hasReceivedNotification(
    caseId: string,
    type: NotificationType | NotificationType[],
    address?: string,
  ) {
    const previousNotifications = await this.notificationModel.findAll({
      where: { caseId, type },
    })

    return previousNotifications.some((notification) => {
      return notification.recipients.some(
        (recipient) => recipient.address === address && recipient.success,
      )
    })
  }

  private getCourtMobileNumbers(courtId?: string) {
    return (
      (courtId && this.config.sms.courtsMobileNumbers[courtId]) ?? undefined
    )
  }

  private async sendSms(
    smsText: string,
    mobileNumbers?: string,
  ): Promise<Recipient> {
    if (!this.config.production && !mobileNumbers) {
      return { address: mobileNumbers, success: true }
    }

    return this.smsService
      .sendSms(mobileNumbers?.split(',') ?? '', smsText)
      .then(() => ({ address: mobileNumbers, success: true }))
      .catch((reason) => {
        this.logger.error('Failed to send sms', { error: reason })

        this.eventService.postErrorEvent(
          'Failed to send sms',
          { mobileNumbers },
          reason,
        )

        return { address: mobileNumbers, success: false }
      })
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
          name: this.config.email.fromName,
          address: this.config.email.fromEmail,
        },
        replyTo: {
          name: this.config.email.replyToName,
          address: this.config.email.replyToEmail,
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

      this.eventService.postErrorEvent(
        'Failed to send email',
        {
          subject,
          to: `${recipientName} (${recipientEmail})`,
          attachments:
            attachments && attachments.length > 0
              ? attachments.reduce(
                  (acc, attachment, index) =>
                    index > 0
                      ? `${acc}, ${attachment.filename}`
                      : `${attachment.filename}`,
                  '',
                )
              : undefined,
        },
        error as Error,
      )

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
    await this.notificationModel.create({
      caseId,
      type,
      recipients: recipients,
    })

    return {
      notificationSent: recipients.reduce(
        (sent, recipient) => sent || recipient.success,
        false as boolean,
      ),
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
        title: `Fyrirtaka í máli ${theCase.courtCaseNumber} - ${theCase.creatingProsecutor?.institution?.name} gegn X`,
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
      this.formatMessage,
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
      this.formatMessage,
      theCase.type,
      theCase.prosecutor?.name,
      theCase.prosecutor?.institution?.name,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private sendResubmittedToCourtSmsNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtResubmittedToCourtSmsNotification(
      this.formatMessage,
      theCase.courtCaseNumber,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private sendResubmittedToCourtEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const { body, subject } = formatDefenderResubmittedToCourtEmailNotification(
      this.formatMessage,
      theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      theCase.court?.name,
      theCase.courtCaseNumber,
    )

    return this.sendEmail(
      subject,
      body,
      theCase.defenderName,
      theCase.defenderEmail,
    )
  }

  private async sendReadyForCourtEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const { id, type, court, policeCaseNumbers, prosecutor } = theCase

    const overviewUrl = `${
      isRestrictionCase(type)
        ? `${this.config.clientUrl}${RESTRICTION_CASE_OVERVIEW_ROUTE}`
        : `${this.config.clientUrl}${INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}`
    }/${id}`

    const { subject, body } = formatProsecutorReadyForCourtEmailNotification(
      this.formatMessage,
      policeCaseNumbers,
      type,
      court?.name,
      overviewUrl,
    )

    return this.sendEmail(subject, body, prosecutor?.name, prosecutor?.email)
  }

  private async sendReadyForCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const notification = await this.notificationModel.findOne({
      where: { caseId: theCase.id, type: NotificationType.READY_FOR_COURT },
    })

    const promises: Promise<Recipient>[] = [
      this.sendReadyForCourtEmailNotificationToProsecutor(theCase),
    ]

    if (notification) {
      if (theCase.state === CaseState.RECEIVED) {
        promises.push(
          this.sendResubmittedToCourtSmsNotificationToCourt(theCase),
        )

        const defenderCourtDateNotificationSent = await this.hasReceivedNotification(
          theCase.id,
          NotificationType.COURT_DATE,
          theCase.defenderEmail,
        )

        if (
          theCase.courtDate &&
          theCase.sendRequestToDefender &&
          theCase.defenderName &&
          theCase.defenderEmail &&
          defenderCourtDateNotificationSent
        ) {
          promises.push(
            this.sendResubmittedToCourtEmailNotificationToDefender(theCase),
          )
        }
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
      this.formatMessage,
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

  private async uploadCourtDateInvitationEmailToCourt(
    theCase: Case,
    user: User,
    subject: string,
    body: string,
    recipients?: string,
  ): Promise<void> {
    try {
      await this.courtService.createEmail(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        subject,
        body,
        recipients ?? '',
        this.config.email.fromEmail,
        this.config.email.fromName,
      )
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to upload email to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private async sendCourtDateEmailNotificationToProsecutor(
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    const { subject, body } = formatProsecutorCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.courtCaseNumber,
      theCase.court?.name,
      theCase.courtDate,
      theCase.courtRoom,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.defenderName,
      theCase.sessionArrangements,
    )
    const calendarInvite = this.createICalAttachment(theCase)

    return this.sendEmail(
      subject,
      body,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
      calendarInvite ? [calendarInvite] : undefined,
    ).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadCourtDateInvitationEmailToCourt(
          theCase,
          user,
          subject,
          body,
          theCase.prosecutor?.email,
        )
      }

      return recipient
    })
  }

  private async sendCourtDateEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonCourtDateEmail.subject,
      { caseType: theCase.type },
    )
    // Assume there is at most one defendant
    const html = formatPrisonCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
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
      Boolean(theCase.parentCase),
      theCase.sessionArrangements,
    )

    return this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      this.config.email.prisonEmail,
    )
  }

  private sendCourtDateEmailNotificationToDefender(
    theCase: Case,
    user: User,
  ): Promise<Recipient>[] {
    const subject = `Fyrirtaka í máli ${theCase.courtCaseNumber}`
    const linkSubject = `Gögn í máli ${theCase.courtCaseNumber}`
    const html = formatDefenderCourtDateEmailNotification(
      this.formatMessage,
      theCase.court?.name,
      theCase.courtCaseNumber,
      theCase.courtDate,
      theCase.courtRoom,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.prosecutor?.name,
      theCase.creatingProsecutor?.institution?.name,
      theCase.sessionArrangements,
    )
    const linkHtml = formatDefenderCourtDateLinkEmailNotification(
      this.formatMessage,
      theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      theCase.court?.name,
      theCase.courtCaseNumber,
    )
    const calendarInvite = this.createICalAttachment(theCase)

    const promises = [
      this.sendEmail(
        subject,
        html,
        theCase.defenderName,
        theCase.defenderEmail,
        calendarInvite ? [calendarInvite] : undefined,
      ).then((recipient) => {
        if (recipient.success) {
          // No need to wait
          this.uploadCourtDateInvitationEmailToCourt(
            theCase,
            user,
            subject,
            html,
            theCase.defenderEmail,
          )
        }
        return recipient
      }),
    ]

    if (theCase.sendRequestToDefender) {
      promises.push(
        this.sendEmail(
          linkSubject,
          linkHtml,
          theCase.defenderName,
          theCase.defenderEmail,
        ),
      )
    }

    return promises
  }

  private async sendCourtDateNotifications(
    theCase: Case,
    user?: User,
    eventOnly?: boolean,
  ): Promise<SendNotificationResponse> {
    if (!user) {
      throw new InternalServerErrorException(
        'User is required for court date notifications',
      )
    }

    this.eventService.postEvent(CaseEvent.SCHEDULE_COURT_DATE, theCase)

    if (eventOnly) {
      return { notificationSent: false }
    }

    const promises: Promise<Recipient>[] = [
      this.sendCourtDateEmailNotificationToProsecutor(theCase, user),
    ]

    if (
      theCase.defenderEmail &&
      (isRestrictionCase(theCase.type) ||
        (isInvestigationCase(theCase.type) &&
          theCase.sessionArrangements &&
          [
            SessionArrangements.ALL_PRESENT,
            SessionArrangements.ALL_PRESENT_SPOKESPERSON,
          ].includes(theCase.sessionArrangements)))
    ) {
      promises.push(
        ...this.sendCourtDateEmailNotificationToDefender(theCase, user),
      )
    }

    if (
      theCase.type === CaseType.CUSTODY ||
      theCase.type === CaseType.ADMISSION_TO_FACILITY
    ) {
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

  private sendRunlingEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    return this.sendEmail(
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
          })
        : this.formatMessage(notifications.signedRuling.subjectV2, {
            courtCaseNumber: theCase.courtCaseNumber,
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.prosecutorBody, {
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            linkStart: `<a href="${this.config.clientUrl}${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${theCase.id}">`,
            linkEnd: '</a>',
          })
        : this.formatMessage(notifications.signedRuling.prosecutorBodyS3V2, {
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
            linkEnd: '</a>',
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
    )
  }

  private async sendRulingEmailNotificationToDefender(
    theCase: Case,
    defenderNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ) {
    return this.sendEmail(
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
          })
        : this.formatMessage(notifications.signedRuling.subjectV2, {
            courtCaseNumber: theCase.courtCaseNumber,
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.defenderBody, {
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            defenderHasAccessToRvg: Boolean(defenderNationalId),
            linkStart: `<a href="${formatDefenderRoute(
              this.config.clientUrl,
              theCase.type,
              theCase.id,
            )}">`,
            linkEnd: '</a>',
          })
        : this.formatMessage(notifications.signedRuling.defenderBodyV2, {
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            defenderHasAccessToRvg: Boolean(defenderNationalId),
            linkStart: `<a href="${formatDefenderRoute(
              this.config.clientUrl,
              theCase.type,
              theCase.id,
            )}">`,
            linkEnd: '</a>',
            signedVerdictAvailableInS3: await this.awsS3Service.objectExists(
              `generated/${theCase.id}/ruling.pdf`,
            ),
          }),
      defenderName ?? '',
      defenderEmail ?? '',
    )
  }

  private async sendRulingEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonRulingEmail.subject,
      { caseType: theCase.type },
    )
    const html = formatPrisonRulingEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.rulingDate,
    )
    const custodyNoticePdf = await getCustodyNoticePdfAsString(
      theCase,
      this.formatMessage,
    )
    const courtRecordPdf = await getCourtRecordPdfAsString(
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
      this.config.email.prisonEmail,
      attachments,
    )
  }

  private async sendRulingEmailNotificationToPrisonAdministration(
    theCase: Case,
  ): Promise<Recipient> {
    const { subject, body } = formatPrisonAdministrationRulingNotification(
      this.formatMessage,
      theCase.courtCaseNumber,
      theCase.court?.name,
      `${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}`,
    )

    return this.sendEmail(
      subject,
      body,
      'Fangelsismálastofnun',
      this.config.email.prisonAdminEmail,
    )
  }

  private async sendRulingNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises = [this.sendRunlingEmailNotificationToProsecutor(theCase)]

    if (isIndictmentCase(theCase.type)) {
      theCase.defendants?.forEach((defendant) => {
        promises.push(
          this.sendRulingEmailNotificationToDefender(
            theCase,
            undefined && defendant.defenderNationalId, // Temporarily dicable links in defender emails for indictments
            defendant.defenderName,
            defendant.defenderEmail,
          ),
        )
      })
    } else if (
      theCase.defenderEmail &&
      (isRestrictionCase(theCase.type) ||
        (isInvestigationCase(theCase.type) &&
          theCase.sessionArrangements &&
          [
            SessionArrangements.ALL_PRESENT,
            SessionArrangements.ALL_PRESENT_SPOKESPERSON,
          ].includes(theCase.sessionArrangements)))
    ) {
      promises.push(
        this.sendRulingEmailNotificationToDefender(
          theCase,
          theCase.defenderNationalId,
          theCase.defenderName,
          theCase.defenderEmail,
        ),
      )
    }

    if (isRestrictionCase(theCase.type)) {
      promises.push(
        this.sendRulingEmailNotificationToPrisonAdministration(theCase),
      )
    }

    if (
      CaseDecision.ACCEPTING === theCase.decision ||
      CaseDecision.ACCEPTING_PARTIALLY === theCase.decision
    ) {
      if (theCase.type === CaseType.CUSTODY) {
        promises.push(this.sendRulingEmailNotificationToPrison(theCase))
      } else if (theCase.type === CaseType.ADMISSION_TO_FACILITY) {
        const inCustody = await this.defendantService.isDefendantInActiveCustody(
          theCase.defendants,
        )
        if (
          inCustody ||
          (theCase.defendants && theCase.defendants[0]?.noNationalId === true)
        ) {
          promises.push(this.sendRulingEmailNotificationToPrison(theCase))
        }
      }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.RULING,
      recipients,
    )
  }

  /* MODIFIED notifications */

  private async sendModifiedNotifications(
    theCase: Case,
    user?: User,
  ): Promise<SendNotificationResponse> {
    if (!user) {
      throw new InternalServerErrorException(
        'User is required for modified notifications',
      )
    }

    const subject = this.formatMessage(notifications.modified.subjectV2, {
      courtCaseNumber: theCase.courtCaseNumber,
      caseType: theCase.type,
    })
    const html = theCase.isCustodyIsolation
      ? this.formatMessage(notifications.modified.isolationHtml, {
          caseType: theCase.type,
          actorInstitution: user.institution?.name,
          actorName: user.name,
          actorTitle: user.title,
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
          validToDate: formatDate(theCase.validToDate, 'PPPp'),
          isolationToDate: formatDate(theCase.isolationToDate, 'PPPp'),
        })
      : this.formatMessage(notifications.modified.htmlV2, {
          caseType: theCase.type,
          actorInstitution: user.institution?.name,
          actorName: user.name,
          actorTitle: user.title,
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
          validToDate: formatDate(theCase.validToDate, 'PPPp'),
        })

    const promises = [
      this.sendEmail(
        subject,
        html,
        'Fangelsismálastofnun',
        this.config.email.prisonAdminEmail,
      ),
    ]

    if (
      theCase.type === CaseType.CUSTODY ||
      theCase.type === CaseType.ADMISSION_TO_FACILITY
    ) {
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
      ]

      promises.push(
        this.sendEmail(
          subject,
          html,
          'Gæsluvarðhaldsfangelsi',
          this.config.email.prisonEmail,
          attachments,
        ),
      )
    }

    if (user.id !== theCase.prosecutorId) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    if (user.id !== theCase.judgeId) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.judge?.name,
          theCase.judge?.email,
        ),
      )
    }

    if (theCase.registrar && user.id !== theCase.registrarId) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.MODIFIED,
      recipients,
    )
  }

  /* REVOKED notifications */

  private async existsRevokableNotification(
    caseId: string,
    address?: string,
    isIndictment?: boolean,
  ): Promise<boolean> {
    return this.hasReceivedNotification(
      caseId,
      isIndictment
        ? [NotificationType.DEFENDER_ASSIGNED]
        : [
            NotificationType.HEADS_UP,
            NotificationType.READY_FOR_COURT,
            NotificationType.COURT_DATE,
          ],
      address,
    )
  }

  private sendRevokedSmsNotificationToCourt(theCase: Case): Promise<Recipient> {
    const smsText = formatCourtRevokedSmsNotification(
      this.formatMessage,
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
    const subject = this.formatMessage(
      notifications.prisonRevokedEmail.subject,
      { caseType: theCase.type },
    )
    // Assume there is at most one defendant
    const html = formatPrisonRevokedEmailNotification(
      this.formatMessage,
      theCase.type,
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
      this.config.email.prisonEmail,
    )
  }

  private sendRevokedEmailNotificationToDefender(
    caseType: CaseType,
    defendant: Defendant,
    defenderName?: string,
    defenderEmail?: string,
    courtDate?: Date,
    courtName?: string,
  ): Promise<Recipient> {
    const subject = isIndictmentCase(caseType)
      ? this.formatMessage(notifications.defenderRevokedEmail.indictmentSubject)
      : this.formatMessage(notifications.defenderRevokedEmail.subject, {
          caseType,
        })

    const html = formatDefenderRevokedEmailNotification(
      this.formatMessage,
      caseType,
      defendant.nationalId,
      defendant.name,
      defendant.noNationalId,
      courtName,
      courtDate,
    )

    return this.sendEmail(subject, html, defenderName, defenderEmail)
  }

  private async sendRevokedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    const courtWasNotified =
      !isIndictmentCase(theCase.type) &&
      (await this.existsRevokableNotification(
        theCase.id,
        this.getCourtMobileNumbers(theCase.courtId),
      ))

    if (courtWasNotified) {
      promises.push(this.sendRevokedSmsNotificationToCourt(theCase))
    }

    const prisonWasNotified =
      (theCase.type === CaseType.CUSTODY ||
        theCase.type === CaseType.ADMISSION_TO_FACILITY) &&
      (await this.existsRevokableNotification(
        theCase.id,
        this.config.email.prisonEmail,
      ))

    if (prisonWasNotified) {
      promises.push(this.sendRevokedEmailNotificationToPrison(theCase))
    }

    if (isIndictmentCase(theCase.type)) {
      for (const defendant of theCase.defendants ?? []) {
        const defenderWasNotified = await this.existsRevokableNotification(
          theCase.id,
          defendant.defenderEmail,
          isIndictmentCase(theCase.type),
        )

        if (defenderWasNotified) {
          promises.push(
            this.sendRevokedEmailNotificationToDefender(
              theCase.type,
              defendant,
              defendant.defenderName,
              defendant.defenderEmail,
              theCase.courtDate,
              theCase.court?.name,
            ),
          )
        }
      }
    } else {
      const defenderWasNotified = await this.existsRevokableNotification(
        theCase.id,
        theCase.defenderEmail,
        isIndictmentCase(theCase.type),
      )
      if (defenderWasNotified && theCase.defendants) {
        promises.push(
          this.sendRevokedEmailNotificationToDefender(
            theCase.type,
            theCase.defendants[0],
            theCase.defenderName,
            theCase.defenderEmail,
            theCase.courtDate,
            theCase.court?.name,
          ),
        )
      }
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      return { notificationSent: false }
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.REVOKED,
      recipients,
    )
  }

  /* DEFENDER_ASSIGNED notifications */

  private async shouldSendDefenderAssignedNotification(
    theCase: Case,
    defenderEmail?: string,
  ): Promise<boolean> {
    if (!defenderEmail) {
      return false
    }

    const hasSentNotificationBefore = await this.hasReceivedNotification(
      theCase.id,
      NotificationType.DEFENDER_ASSIGNED,
      defenderEmail,
    )

    if (hasSentNotificationBefore) {
      return false
    }

    return true
  }

  private sendDefenderAssignedNotification(
    theCase: Case,
    defenderNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ): Promise<Recipient> {
    const { subject, body } = formatDefenderAssignedEmailNotification(
      this.formatMessage,
      theCase,
      defenderNationalId
        ? `${this.config.clientUrl}${DEFENDER_ROUTE}/${theCase.id}`
        : undefined,
    )

    return this.sendEmail(subject, body, defenderName, defenderEmail)
  }

  private async sendDefenderAssignedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    if (isIndictmentCase(theCase.type)) {
      const uniqDefendants = _uniqBy(
        theCase.defendants ?? [],
        (d: Defendant) => d.defenderEmail,
      )
      for (const defendant of uniqDefendants) {
        const { defenderEmail, defenderNationalId, defenderName } = defendant

        const shouldSend = await this.shouldSendDefenderAssignedNotification(
          theCase,
          defenderEmail,
        )

        if (shouldSend === true) {
          promises.push(
            this.sendDefenderAssignedNotification(
              theCase,
              undefined && defenderNationalId, // Temporarily disable links in defender emails for indictments
              defenderName,
              defenderEmail,
            ),
          )
        }
      }
    } else {
      const { defenderEmail, defenderNationalId, defenderName } = theCase

      const shouldSend = await this.shouldSendDefenderAssignedNotification(
        theCase,
        defenderEmail,
      )

      if (shouldSend === true) {
        promises.push(
          this.sendDefenderAssignedNotification(
            theCase,
            defenderNationalId,
            defenderName,
            defenderEmail,
          ),
        )
      }
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      return { notificationSent: false }
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.DEFENDER_ASSIGNED,
      recipients,
    )
  }

  /* DEFENDANTS_NOT_UPDATED_AT_COURT notifications */

  private async sendDefendantsNotUpdatedAtCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    if (
      (await this.hasReceivedNotification(
        theCase.id,
        NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
        theCase.judge?.email,
      )) ||
      (await this.hasReceivedNotification(
        theCase.id,
        NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
        theCase.registrar?.email,
      ))
    ) {
      return { notificationSent: true }
    }

    const subject = this.formatMessage(
      notifications.defendantsNotUpdatedAtCourt.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(
      notifications.defendantsNotUpdatedAtCourt.body,
      { courtCaseNumber: theCase.courtCaseNumber },
    )

    const promises = [
      this.sendEmail(subject, html, theCase.judge?.name, theCase.judge?.email),
    ]

    if (theCase.registrar) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
      recipients,
    )
  }

  /* Messages */

  private async addMessagesForHeadsUpNotificationToQueue(
    theCase: Case,
  ): Promise<void> {
    return this.messageService.sendMessageToQueue({
      type: MessageType.SEND_HEADS_UP_NOTIFICATION,
      caseId: theCase.id,
    })
  }

  private async addMessagesForReadyForCourtNotificationToQueue(
    theCase: Case,
  ): Promise<void> {
    const messages = [
      {
        type: MessageType.SEND_READY_FOR_COURT_NOTIFICATION,
        caseId: theCase.id,
      },
    ]

    if (theCase.state === CaseState.RECEIVED) {
      messages.push({
        type: MessageType.DELIVER_REQUEST_TO_COURT,
        caseId: theCase.id,
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private async addMessagesForReceivedByCourtNotificationToQueue(
    theCase: Case,
  ): Promise<void> {
    return this.messageService.sendMessageToQueue({
      type: MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION,
      caseId: theCase.id,
    })
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
    user?: User,
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
        return this.sendCourtDateNotifications(
          theCase,
          user,
          notification.eventOnly,
        )
      case NotificationType.RULING:
        return this.sendRulingNotifications(theCase)
      case NotificationType.MODIFIED:
        return this.sendModifiedNotifications(theCase, user)
      case NotificationType.REVOKED:
        return this.sendRevokedNotifications(theCase)
      case NotificationType.DEFENDER_ASSIGNED:
        return this.sendDefenderAssignedNotifications(theCase)
      case NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT:
        return this.sendDefendantsNotUpdatedAtCourtNotifications(theCase)
    }
  }

  async addMessagesForNotificationToQueue(
    theCase: Case,
    notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    try {
      switch (notification.type) {
        case NotificationType.HEADS_UP:
          await this.addMessagesForHeadsUpNotificationToQueue(theCase)
          break
        case NotificationType.READY_FOR_COURT:
          await this.addMessagesForReadyForCourtNotificationToQueue(theCase)
          break
        case NotificationType.RECEIVED_BY_COURT:
          await this.addMessagesForReceivedByCourtNotificationToQueue(theCase)
          break
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${notification.type}`,
          )
      }

      return { notificationSent: true }
    } catch (error) {
      return { notificationSent: false }
    }
  }
}
