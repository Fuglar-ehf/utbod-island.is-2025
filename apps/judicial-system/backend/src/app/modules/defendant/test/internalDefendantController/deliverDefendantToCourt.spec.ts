import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { User } from '../../../user'
import { CourtService } from '../../../court'
import { Case } from '../../../case'
import { DeliverDefendantToCourtDto } from '../../dto/deliverDefendantToCourt.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Defendant } from '../../models/defendant.model'
import { createTestingDefendantModule } from '../createTestingDefendantModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantId: string,
  body: DeliverDefendantToCourtDto,
  user: User,
  theCase: Case,
  defendant: Defendant,
) => Promise<Then>

describe('InternalDefendantController - Deliver defendant to court', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const defendantId = uuid()
  const defendantNationalId = '1234567890'
  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
  } as Defendant
  const caseId = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const defenderEmail = uuid()
  const theCase = {
    id: caseId,
    courtId,
    courtCaseNumber,
    defenderEmail,
  } as Case

  let mockMessageService: MessageService
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      courtService,
      internalDefendantController,
    } = await createTestingDefendantModule()

    mockMessageService = messageService
    mockCourtService = courtService
    const mockUpdateCaseWithDefendant = mockCourtService.updateCaseWithDefendant as jest.Mock
    mockUpdateCaseWithDefendant.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      defendantId: string,
      body: DeliverDefendantToCourtDto,
      user: User,
      theCase: Case,
      defendant: Defendant,
    ) => {
      const then = {} as Then

      await internalDefendantController
        .deliverDefendantToCourt(
          caseId,
          defendantId,
          body,
          user,
          theCase,
          defendant,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateCaseWithDefendant = mockCourtService.updateCaseWithDefendant as jest.Mock
      mockUpdateCaseWithDefendant.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(
        caseId,
        defendantId,
        { userId },
        user,
        theCase,
        defendant,
      )
    })

    it('should deliver the defendant', () => {
      expect(mockCourtService.updateCaseWithDefendant).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        defendantNationalId,
        defenderEmail,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  // TODO: Run test wehen ready to send notifications
  describe.skip('no national id', () => {
    beforeEach(async () => {
      await givenWhenThen(caseId, defendantId, { userId }, user, theCase, {
        ...defendant,
        noNationalId: true,
      } as Defendant)
    })

    it('should send email to court', () => {
      expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
        type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
        caseId,
      })
    })
  })

  describe('delivery fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseId,
        defendantId,
        { userId },
        user,
        theCase,
        defendant,
      )
    })

    it('should return a failure response', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
