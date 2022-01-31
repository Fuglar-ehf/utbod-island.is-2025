import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize/types'

import { CaseType, User as TUser } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { DefendantService } from '../../defendant/defendant.service'
import { User } from '../../user'
import { Institution } from '../../institution'
import { Defendant } from '../../defendant/models/defendant.model'
import { CreateCaseDto } from '../dto'
import { Case } from '../models'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (user: TUser, caseToCreate: CreateCaseDto) => Promise<Then>

describe('CaseController - Create', () => {
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

    givenWhenThen = async (user: TUser, caseToCreate: CreateCaseDto) => {
      const then = {} as Then

      try {
        then.result = await caseController.create(user, caseToCreate)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case created', () => {
    const userId = uuid()
    const user = { id: userId } as TUser
    const caseToCreate = {
      type: CaseType.AUTOPSY,
      description: 'Some details',
      policeCaseNumber: '007-2021-777',
      defenderName: 'John Jhon',
      defenderEmail: 'john@dummy.is',
      defenderPhoneNumber: '1234567',
      sendRequestToDefender: false,
      courtId: uuid(),
      leadInvestigator: 'The Boss',
    }

    beforeEach(async () => {
      await givenWhenThen(user, caseToCreate)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          creatingProsecutorId: userId,
          prosecutorId: userId,
        },
        { transaction },
      )
    })
  })

  describe('defendant created', () => {
    const userId = uuid()
    const user = { id: userId } as TUser
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(user, caseToCreate)
    })

    it('should create a defendant', () => {
      expect(mockDefendantService.create).toHaveBeenCalledWith(
        caseId,
        {},
        transaction,
      )
    })
  })

  describe('case lookup', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(user, caseToCreate)
    })

    it('should lookup the newly created case', () => {
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
        where: { id: caseId },
      })
    })
  })

  describe('case returned', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const createdCase = {} as Case
    const returnedCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should return case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('case creation fails', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('defendant creation fails', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const createdCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockDefendantCreate = mockDefendantService.create as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case lookup fails', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const createdCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
