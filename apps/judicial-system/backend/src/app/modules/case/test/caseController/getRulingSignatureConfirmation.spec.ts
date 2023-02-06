import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize/types'

import { ForbiddenException } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  User,
} from '@island.is/judicial-system/types'
import { MessageType, MessageService } from '@island.is/judicial-system/message'

import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
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

describe('CaseController - Get ruling signature confirmation', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockMessageService: MessageService
  let mockAwsS3Service: AwsS3Service
  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      awsS3Service,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockCaseModel = caseModel
    mockMessageService = messageService
    mockAwsS3Service = awsS3Service

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockPutObject = mockAwsS3Service.putObject as jest.Mock
    mockPutObject.mockResolvedValue(uuid())
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockPostMessageToQueue = mockMessageService.sendMessagesToQueue as jest.Mock
    mockPostMessageToQueue.mockResolvedValue(undefined)

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      documentToken: string,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.getRulingSignatureConfirmation(
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

  describe('successful completion', () => {
    const caseFileId = uuid()
    const caseId = uuid()
    const theCase = {
      id: caseId,
      caseFiles: [
        {
          id: caseFileId,
          key: uuid(),
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.CASE_FILE,
        },
        {
          id: uuid(),
          key: uuid(),
          state: CaseFileState.STORED_IN_COURT,
          category: CaseFileCategory.CASE_FILE,
        },
      ],
      judgeId: userId,
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should set the ruling date', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { rulingDate: expect.any(Date) },
        { where: { id: caseId }, transaction },
      )
    })

    it('should return success', () => {
      expect(mockAwsS3Service.putObject).toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.DELIVER_SIGNED_RULING_TO_COURT, userId, caseId },
        { type: MessageType.SEND_RULING_NOTIFICATION, userId, caseId },
        {
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          userId,
          caseId,
          caseFileId,
        },
        { type: MessageType.DELIVER_COURT_RECORD_TO_COURT, userId, caseId },
      ])
      expect(then.result).toEqual({ documentSigned: true })
    })
  })

  describe('successful completion of LÖKE case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      judgeId: userId,
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should set the ruling date', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { rulingDate: expect.any(Date) },
        { where: { id: caseId }, transaction },
      )
    })

    it('should return success', () => {
      expect(mockAwsS3Service.putObject).toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.DELIVER_SIGNED_RULING_TO_COURT, userId, caseId },
        { type: MessageType.SEND_RULING_NOTIFICATION, userId, caseId },
        { type: MessageType.DELIVER_COURT_RECORD_TO_COURT, userId, caseId },
        { type: MessageType.DELIVER_CASE_TO_POLICE, userId, caseId },
      ])
      expect(then.result).toEqual({ documentSigned: true })
    })
  })

  describe('successful completion of extended LÖKE case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      judgeId: userId,
      parentCaseId: uuid(),
    } as Case
    const documentToken = uuid()

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should return success', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        { type: MessageType.DELIVER_SIGNED_RULING_TO_COURT, userId, caseId },
        { type: MessageType.SEND_RULING_NOTIFICATION, userId, caseId },
        { type: MessageType.DELIVER_COURT_RECORD_TO_COURT, userId, caseId },
      ])
    })
  })

  describe('user is not the assigned judge', () => {
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid() } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'A ruling must be signed by the assigned judge',
      )
    })
  })

  describe('database update fails', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      judgeId: userId,
      policeCaseNumbers: ['007-2022-1'],
    } as Case
    const documentToken = uuid()
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

  describe('database update for modified ruling', () => {
    const caseId = uuid()
    const userId = uuid()
    const judge = {
      id: userId,
      name: 'Judge Judgesen',
      title: 'Héraðrsdómari',
    } as User
    const theCase = ({
      id: caseId,
      judgeId: userId,
      rulingDate: randomDate(),
      judge: judge,
    } as unknown) as Case
    const documentToken = uuid()

    beforeEach(async () => {
      await givenWhenThen(caseId, judge, theCase, documentToken)
    })

    it('should set the ruling date and ruling modified history', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        {
          rulingDate: expect.any(Date),
          rulingModifiedHistory: expect.any(String),
        },
        { where: { id: caseId }, transaction },
      )
    })
  })

  describe('AWS S3 upload failed', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      judgeId: userId,
      policeCaseNumbers: ['007-2022-1'],
    } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should fail and return that the document was not signed', () => {
      expect(then.result.documentSigned).toBe(false)
      expect(then.result.message).toBeTruthy()
      expect(then.result.code).toBeUndefined()

      expect(mockCaseModel.update).not.toHaveBeenCalled()
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })
})
