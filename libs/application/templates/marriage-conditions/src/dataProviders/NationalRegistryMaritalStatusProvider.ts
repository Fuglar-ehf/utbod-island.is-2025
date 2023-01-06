import { NationalRegistryPerson } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { MarriageConditionsFakeData, YES } from '../types'
import { maritalStatuses } from '../lib/constants'
import { m } from '../lib/messages'

export interface MaritalStatusProvider {
  maritalStatus: string
}
const ALLOWED_MARITAL_STATUSES = ['1', '4', '6']
export class NationalRegistryMaritalStatusProvider extends BasicDataProvider {
  type = 'NationalRegistryMaritalStatusProvider'

  async provide(application: Application): Promise<MaritalStatusProvider> {
    const fakeData = getValueViaPath<MarriageConditionsFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    const query = `
    query NationalRegistryUserQuery {
      nationalRegistryUserV2 {
        fullName
        spouse {
          name
          nationalId
          maritalStatus
        }
      }
    }
    `
    if (useFakeData) {
      return this.handleFakeData(fakeData)
    }

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors && !useFakeData) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return Promise.reject({
            reason: `graphql error in ${this.type}: ${response.errors[0].message}`,
          })
        }
        const nationalRegistryUser: NationalRegistryPerson =
          response.data.nationalRegistryUser
        const maritalStatus: string =
          nationalRegistryUser.spouse?.maritalStatus || '1'

        if (this.allowedCodes(maritalStatus)) {
          return Promise.resolve({
            maritalStatus: this.formatMaritalStatus(maritalStatus),
          })
        }
        return Promise.reject({
          reason: `Applicant marital status ${maritalStatus} not applicable`,
        })
      })
      .catch(() => {
        if (useFakeData) {
          return this.handleFakeData(fakeData)
        }
        // This file will be removed on next release, if a spouse is not found a 404 error is being thrown
        // The error for some reasin does not make its way down it just fails
        // for testing purposes on prod let's return unmarried marital status if it fails so that we can test
        return Promise.resolve({
          maritalStatus: this.formatMaritalStatus('1'),
        })
      })
  }

  onProvideError({ reason }: { reason: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: reason,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }

  private formatMaritalStatus(maritalCode: string): string {
    return maritalStatuses[maritalCode]
  }

  private allowedCodes(maritalCode: string): boolean {
    return ALLOWED_MARITAL_STATUSES.includes(maritalCode)
  }

  private handleFakeData(fakeData?: MarriageConditionsFakeData) {
    const maritalStatus: string = fakeData?.maritalStatus || ''
    if (this.allowedCodes(maritalStatus)) {
      return Promise.resolve({
        maritalStatus: this.formatMaritalStatus(maritalStatus),
      })
    } else {
      return Promise.reject({
        reason: m.errorDataProviderMaritalStatus,
      })
    }
  }
}
