import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  DateType,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { SendInternalNotificationDto } from '../../dto/sendInternalNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationDto: SendInternalNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send court date notifications', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController, notificationModel } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async (
      theCase: Case,
      notificationDto: SendInternalNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent', () => {
    let then: Then

    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutorName, email: prosecutorEmail },
      court: { name: courtName },
      courtCaseNumber,
      defenderName,
      defenderEmail,
    } as Case

    beforeEach(async () => {
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([])

      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Fyrirtaka í máli: ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Verjandi sakbornings: ${defenderName}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Fyrirtaka í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Málsnúmer: ${courtCaseNumber}.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: .<br /><br />Sækjandi: ${prosecutorName} ().`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('link not sent to defender', () => {
    let then: Then

    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutorName, email: prosecutorEmail },
      court: { name: courtName },
      courtCaseNumber,
      defenderName,
      defenderEmail,
    } as Case

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([
        {
          caseId,
          type: NotificationType.READY_FOR_COURT,
          recipients: [{ address: defenderEmail, success: true }],
        } as Notification,
      ])

      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should not send link to case to defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent for postponed indictment', () => {
    let then: Then

    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.COURT_DATE,
    }

    const courtDate = new Date(2024, 4, 2, 14, 32)
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      prosecutor: { name: prosecutorName, email: prosecutorEmail },
      defendants: [
        {
          defenderName,
          defenderEmail,
        },
      ],
      court: { name: courtName },
      courtCaseNumber,
      dateLogs: [{ dateType: DateType.COURT_DATE, date: courtDate }],
    } as Case

    beforeEach(async () => {
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([])

      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Frestun - nýtt þinghald í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur boðar til þinghalds í máli ${courtCaseNumber}.<br />Fyrirtaka mun fara fram 2. maí 2024, kl. 14:32.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/akaera/stadfesta/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Frestun - nýtt þinghald í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur boðar til þinghalds í máli ${courtCaseNumber}.<br />Fyrirtaka mun fara fram 2. maí 2024, kl. 14:32.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Hægt er að nálgast gögn málsins hjá Héraðsdómur Reykjavíkur.`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
