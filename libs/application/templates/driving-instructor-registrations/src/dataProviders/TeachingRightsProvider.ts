import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { HasTeachingRights } from '@island.is/api/schema'
import { m } from '../lib/messages'

export class TeachingRightsProvider extends BasicDataProvider {
  type = 'TeachingRightsProvider'

  async provide(): Promise<HasTeachingRights> {
    const query = `
      query DrivingLicenseTeachingRights {
        drivingLicenseTeachingRights {
          nationalId
          hasTeachingRights
        }
      }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      if (!res.ok) {
        console.error('failed http request', { res })
        return Promise.reject({ reason: m.dataCollectionNoConnection })
      }

      const response = await res.json()

      const drivingLicenseTeachingRights =
        response.data.drivingLicenseTeachingRights

      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve({})
      }

      if (drivingLicenseTeachingRights.hasTeachingRights) {
        return Promise.resolve(drivingLicenseTeachingRights)
      } else {
        return Promise.reject({
          reason: m.dataCollectionNoRightsError,
        })
      }
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
}
