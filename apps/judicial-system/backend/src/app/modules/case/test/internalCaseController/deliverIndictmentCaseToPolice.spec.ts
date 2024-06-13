import { Base64 } from 'js-base64'
import { uuid } from 'uuidv4'

import {
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver indictment case to police', () => {
  const date = randomDate()
  const userId = uuid()
  const user = { id: userId } as User

  let mockAwsS3Service: AwsS3Service
  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, policeService, internalCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    mockPoliceService = policeService

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockGetObject = awsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentCaseToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver case to police', () => {
    const caseId = uuid()
    const caseType = CaseType.INDICTMENT
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const courtRecordKey = uuid()
    const courtRecordPdf = 'test court record'
    const rulingKey = uuid()
    const rulingPdf = 'test ruling'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: defendantNationalId }],
      caseFiles: [
        { key: courtRecordKey, category: CaseFileCategory.COURT_RECORD },
        { key: rulingKey, category: CaseFileCategory.RULING },
      ],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(courtRecordPdf)
      mockGetObject.mockResolvedValueOnce(rulingPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should update the police case', async () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        caseType,
        caseState,
        courtRecordKey,
      )
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        caseType,
        caseState,
        rulingKey,
      )
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        date,
        '',
        [
          {
            type: PoliceDocumentType.RVTB,
            courtDocument: Base64.btoa(courtRecordPdf),
          },
          {
            type: PoliceDocumentType.RVDO,
            courtDocument: Base64.btoa(rulingPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})
