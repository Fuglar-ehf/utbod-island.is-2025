import { uuid } from 'uuidv4'
import each from 'jest-each'

import { ForbiddenException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../../models/case.model'
import { SignatureConfirmationResponse } from '../../models/signatureConfirmation.response'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface Then {
  result: SignatureConfirmationResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  documentToken: string,
) => Promise<Then>

describe('CaseController - Get court record signature confirmation', () => {
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, caseController } = await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      documentToken: string,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.getCourtRecordSignatureConfirmation(
          caseId,
          user,
          theCase,
          documentToken,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  each`
    assignedRole
    ${'judgeId'}
    ${'registrarId'}
  `.describe('given an assigned role', ({ assignedRole }) => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid(), registrarId: uuid() } as Case
    ;((theCase as unknown) as { [key: string]: string })[assignedRole] = userId
    const documentToken = uuid()

    describe('database update', () => {
      beforeEach(async () => {
        await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should set the court record signatory and signature date', () => {
        expect(mockCaseModel.update).toHaveBeenCalledWith(
          {
            courtRecordSignatoryId: userId,
            courtRecordSignatureDate: expect.any(Date),
          },
          { where: { id: caseId } },
        )
      })
    })

    describe('successful completion', () => {
      let then: Then

      beforeEach(async () => {
        const mockUpdate = mockCaseModel.update as jest.Mock
        mockUpdate.mockResolvedValueOnce([1, [theCase]])

        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should return success', () => {
        expect(then.result).toEqual({ documentSigned: true })
      })
    })

    describe('database update fails', () => {
      let then: Then

      beforeEach(async () => {
        const mockUpdate = mockCaseModel.update as jest.Mock
        mockUpdate.mockRejectedValueOnce(new Error('Some error'))

        then = await givenWhenThen(caseId, user, theCase, documentToken)
      })

      it('should throw Error', () => {
        expect(then.error).toBeInstanceOf(Error)
        expect(then.error.message).toBe('Some error')
      })
    })
  })

  describe('user is not the assigned judge or registrar', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid(), registrarId: uuid() } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'A court record must be signed by the assigned judge or registrar',
      )
    })
  })
})
