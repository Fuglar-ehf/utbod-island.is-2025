import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize/types'

import {
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseType,
  Gender,
  User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { DefendantService, Defendant } from '../../defendant'
import { User } from '../../user'
import { Institution } from '../../institution'
import { Case } from '../models/case.model'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: TUser,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Extend', () => {
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()
    mockDefendantService = defendantService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseId: string, user: TUser, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.extend(caseId, user, theCase)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case extended', () => {
    const userId = uuid()
    const user = { id: userId } as TUser
    const caseId = uuid()
    const type = CaseType.CUSTODY
    const description = 'Some details'
    const policeCaseNumber = '007-2021-777'
    const defenderName = 'John Doe'
    const defenderEmail = 'john@dummy.is'
    const defenderPhoneNumber = '1234567'
    const leadInvestigator = 'The Boss'
    const courtId = uuid()
    const translator = 'Bob Smith'
    const lawsBroken = 'Broken laws'
    const legalBasis = 'Legal basis for custody'
    const legalProvisions = [CaseLegalProvisions._100_1]
    const requestedCustodyRestrictions = [CaseCustodyRestrictions.ISOLATION]
    const caseFacts = 'This happened'
    const legalArguments = 'This is why custody is needed'
    const requestProsecutorOnlySession = false
    const prosecutorOnlySessionRequest = 'The prosecutors wants an exclusive'
    const rulingDate = new Date()
    const theCase = {
      id: caseId,
      type,
      description,
      policeCaseNumber,
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      leadInvestigator,
      courtId,
      translator,
      lawsBroken,
      legalBasis,
      legalProvisions,
      requestedCustodyRestrictions,
      caseFacts,
      legalArguments,
      requestProsecutorOnlySession,
      prosecutorOnlySessionRequest,
      rulingDate,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase)
    })

    it('should extend case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          type,
          description,
          policeCaseNumber,
          defenderName,
          defenderEmail,
          defenderPhoneNumber,
          leadInvestigator,
          courtId,
          translator,
          lawsBroken,
          legalBasis,
          legalProvisions,
          requestedCustodyRestrictions,
          caseFacts,
          legalArguments,
          requestProsecutorOnlySession,
          prosecutorOnlySessionRequest,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          parentCaseId: caseId,
          initialRulingDate: rulingDate,
        },
        { transaction },
      )
    })
  })

  describe('extended case extended', () => {
    const userId = uuid()
    const user = { id: userId } as TUser
    const caseId = uuid()
    const type = CaseType.CUSTODY
    const description = 'Some details'
    const policeCaseNumber = '007-2021-777'
    const defenderName = 'John Doe'
    const defenderEmail = 'john@dummy.is'
    const defenderPhoneNumber = '1234567'
    const leadInvestigator = 'The Boss'
    const courtId = uuid()
    const translator = 'Bob Smith'
    const lawsBroken = 'Broken laws'
    const legalBasis = 'Legal basis for custody'
    const legalProvisions = [CaseLegalProvisions._100_1]
    const requestedCustodyRestrictions = [CaseCustodyRestrictions.ISOLATION]
    const caseFacts = 'This happened'
    const legalArguments = 'This is why custody is needed'
    const requestProsecutorOnlySession = false
    const prosecutorOnlySessionRequest = 'The prosecutors wants an exclusive'
    const initialRulingDate = new Date()
    const theCase = {
      id: caseId,
      type,
      description,
      policeCaseNumber,
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      leadInvestigator,
      courtId,
      translator,
      lawsBroken,
      legalBasis,
      legalProvisions,
      requestedCustodyRestrictions,
      caseFacts,
      legalArguments,
      requestProsecutorOnlySession,
      prosecutorOnlySessionRequest,
      initialRulingDate,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase)
    })

    it('should extend case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          type,
          description,
          policeCaseNumber,
          defenderName,
          defenderEmail,
          defenderPhoneNumber,
          leadInvestigator,
          courtId,
          translator,
          lawsBroken,
          legalBasis,
          legalProvisions,
          requestedCustodyRestrictions,
          caseFacts,
          legalArguments,
          requestProsecutorOnlySession,
          prosecutorOnlySessionRequest,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          parentCaseId: caseId,
          initialRulingDate,
        },
        { transaction },
      )
    })
  })

  describe('copy defendants', () => {
    const user = {} as TUser
    const caseId = uuid()
    const defendantOne = {
      nationalId: '0000000000',
      name: 'Thing 1',
      gender: Gender.MALE,
      address: 'House 1',
    }
    const defendantTwo = {
      nationalId: '0000001111',
      name: 'Thing 2',
      gender: Gender.FEMALE,
      address: 'House 2',
    }
    const theCase = {
      id: caseId,
      defendants: [defendantOne, defendantTwo],
    } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should copy defendants', () => {
      expect(mockDefendantService.create).toHaveBeenCalledTimes(2)
      expect(mockDefendantService.create).toHaveBeenCalledWith(
        extendedCaseId,
        defendantOne,
        transaction,
      )
      expect(mockDefendantService.create).toHaveBeenCalledWith(
        extendedCaseId,
        defendantTwo,
        transaction,
      )
    })
  })

  describe('case lookup', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should lookup the newly extended case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include: [
          { model: Defendant, as: 'defendants' },
          { model: Institution, as: 'court' },
          {
            model: User,
            as: 'creatingProsecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'prosecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Institution, as: 'sharedWithProsecutorsOffice' },
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
          {
            model: User,
            as: 'courtRecordSignatory',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Case, as: 'parentCase' },
          { model: Case, as: 'childCase' },
        ],
        order: [[{ model: Defendant, as: 'defendants' }, 'created', 'ASC']],
        where: { id: extendedCaseId },
      })
    })
  })

  describe('case returned', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }
    const returnedCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should return case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('case creation fails', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('defendant creation fails', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId, defendants: [{}] } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)
      const mockDefendantCreate = mockDefendantService.create as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case lookup fails', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
