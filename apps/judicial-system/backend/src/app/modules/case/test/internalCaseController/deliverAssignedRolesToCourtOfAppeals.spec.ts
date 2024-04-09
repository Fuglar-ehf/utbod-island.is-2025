import { uuid } from 'uuidv4'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalCaseController - Deliver assigned roles to court of appeals', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const appealCaseNumber = uuid()
  const appealAssistantId = uuid()
  const appealJudge1Id = uuid()
  const appealJudge2Id = uuid()
  const appealJudge3Id = uuid()
  const appealAssistantNationalId = uuid()
  const appealJudge1NationalId = uuid()
  const appealJudge2NationalId = uuid()
  const appealJudge3NationalId = uuid()

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    appealCaseNumber,
    appealAssistantId,
    appealJudge1Id,
    appealJudge2Id,
    appealJudge3Id,
    appealAssistant: { nationalId: appealAssistantNationalId },
    appealJudge1: { nationalId: appealJudge1NationalId },
    appealJudge2: { nationalId: appealJudge2NationalId },
    appealJudge3: { nationalId: appealJudge3NationalId },
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateAppealCaseWithAssignedRoles =
      mockCourtService.updateAppealCaseWithAssignedRoles as jest.Mock
    mockUpdateAppealCaseWithAssignedRoles.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverAssignedRolesToCourtOfAppeals(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('received date delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(
        mockCourtService.updateAppealCaseWithAssignedRoles,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        appealCaseNumber,
        appealAssistantNationalId,
        appealJudge1NationalId,
        appealJudge2NationalId,
        appealJudge3NationalId,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
