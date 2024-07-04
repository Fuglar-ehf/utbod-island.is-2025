import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { SendInternalNotificationDto } from '../../dto/sendInternalNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationDto: SendInternalNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send indictment returned notification', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const policeCaseNumbers = [uuid(), uuid()]
  const courtName = uuid()

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

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
      type: NotificationType.INDICTMENT_RETURNED,
    }

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      prosecutor: { name: prosecutorName, email: prosecutorEmail },
      policeCaseNumbers,
      court: { name: courtName },
    } as Case

    beforeEach(async () => {
      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Ákæra endursend í máli ${policeCaseNumbers[0]}`,
          html: `${courtName} hefur endursent ákæru vegna lögreglumáls ${policeCaseNumbers[0]}. Þú getur nálgast samantekt málsins á <a href="http://localhost:4200/akaera/stadfesta/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
