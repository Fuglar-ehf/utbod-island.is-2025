import { uuid } from 'uuidv4'
import fetch from 'node-fetch'
import { Base64 } from 'js-base64'
import { Agent } from 'https'

import { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'
import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { randomDate } from '../../../test'
import { policeModuleConfig } from '../police.config'
import { createTestingPoliceModule } from './createTestingPoliceModule'

jest.mock('node-fetch')

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('PoliceController - Update Police Case', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const caseType = CaseType.CUSTODY
  const caseState = CaseState.ACCEPTED
  const policeCaseNumber = uuid()
  const defendantNationalId = uuid()
  const validToDate = randomDate()
  const caseConclusion = 'test conclusion'
  const requestPdf = 'test request pdf'
  const courtRecordPdf = 'test court record pdf'
  const rulingPdf = 'test ruling pdf'

  let mockConfig: ConfigType<typeof policeModuleConfig>
  let xRoadPath: string
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ ok: true }),
    })

    const { config, policeService } = await createTestingPoliceModule()

    mockConfig = config
    xRoadPath = createXRoadAPIPath(
      config.tlsBasePathWithEnv,
      XRoadMemberClass.GovernmentInstitution,
      config.policeMemberCode,
      config.policeApiPath,
    )

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          defendantNationalId,
          validToDate,
          caseConclusion,
          requestPdf,
          courtRecordPdf,
          rulingPdf,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('update police case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should update the police case', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${xRoadPath}/V2/UpdateRVCase/${caseId}`,
        {
          method: 'PUT',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            'X-Road-Client': mockConfig.clientId,
            'X-API-KEY': mockConfig.policeApiKey,
          },
          agent: expect.any(Agent),
          body: JSON.stringify({
            rvMal_ID: caseId,
            caseNumber: policeCaseNumber,
            ssn: defendantNationalId,
            type: caseType,
            courtVerdict: caseState,
            expiringDate: validToDate,
            courtVerdictString: caseConclusion,
            courtDocuments: [
              { type: 'RVKR', courtDocument: Base64.btoa(requestPdf) },
              { type: 'RVTB', courtDocument: Base64.btoa(courtRecordPdf) },
              { type: 'RVUR', courtDocument: Base64.btoa(rulingPdf) },
            ],
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })
})
