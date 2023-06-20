import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'
import { User } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { PoliceCaseInfo } from '../models/policeCaseInfo.model'
import { createTestingPoliceModule } from './createTestingPoliceModule'

jest.mock('isomorphic-fetch')

interface Then {
  result: PoliceCaseInfo[]
  error: Error & { detail: string }
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('PoliceController - Get police case info', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeController } = await createTestingPoliceModule()

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await policeController
        .getPoliceCaseInfo(caseId, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('police case info found', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          malsnumer: '007-2021-000001',
          skjol: [
            { malsnumer: '007-2021-000001' },
            { malsnumer: '007-2020-000103' },
            { malsnumer: '007-2020-000057' },
            { malsnumer: '008-2013-000033' },
            { malsnumer: '008-2013-000033' },
          ],
          malseinings: [
            {
              upprunalegtMalsnumer: '007-2021-000001',
              brotFra: '2021-02-23T13:17:00',
              vettvangur: 'Testgata 1, 101',
            },
            {
              upprunalegtMalsnumer: '007-2020-000103',
            },
          ],
        }),
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should return police case info without duplicates', () => {
      expect(then.result).toEqual([
        {
          policeCaseNumber: '007-2021-000001',
          place: 'Testgata 1, 101',
          date: new Date('2021-02-23T13:17:00'),
        },
        { policeCaseNumber: '007-2020-000103' },
        { policeCaseNumber: '007-2020-000057' },
        { policeCaseNumber: '008-2013-000033' },
      ])
    })
  })

  describe('police case info not found', () => {
    const user = {} as User
    const originalAncestorCaseId = uuid()
    const theCase = { id: originalAncestorCaseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({ ok: false, text: () => 'Some error' })

      then = await givenWhenThen(uuid(), user, theCase)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Police case info for case ${originalAncestorCaseId} does not exist`,
      )
    })
  })
})
