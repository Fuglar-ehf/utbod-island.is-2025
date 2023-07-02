import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import {
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  role: UserRole,
  defenderNationalId?: string,
) => Promise<Then>

describe('InternalNotificationController - Send appeal to court of appeals notifications', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const registrarName = uuid()
  const registrarEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtCaseNumber = uuid()

  let mockEmailService: EmailService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (role: UserRole, defenderNationalId?: string) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            prosecutor: { name: prosecutorName, email: prosecutorEmail },
            judge: { name: judgeName, email: judgeEmail },
            registrar: { name: registrarName, email: registrarEmail },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defenderName,
            defenderEmail: defenderEmail,
            courtCaseNumber,
          } as Case,
          {
            user: { id: userId, role } as User,
            type: NotificationType.APPEAL_TO_COURT_OF_APPEALS,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('notification sent by prosecutor', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR, uuid())
    })

    it('should send notification to judge and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrarName, address: registrarEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/verjandi/krafa/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR)
    })

    it('should send notification to judge and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by defender', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.DEFENDER, uuid())
    })

    it('should send notification to judge and prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
