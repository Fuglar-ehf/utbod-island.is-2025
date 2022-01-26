import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { Ship } from '@island.is/api/schema'
import * as Sentry from '@sentry/react'
import { queryShips } from '../graphql/queries'

interface GeneralFishingLicenseProps {
  ships: Ship[]
}

export class GeneralFishingLicenseProvider extends BasicDataProvider {
  type = 'GeneralFishingLicenseProvider'

  async queryShips(): Promise<Ship[]> {
    return this.useGraphqlGateway(queryShips).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        return this.handleError(response.errors)
      }

      return Promise.resolve(response.data.ships)
    })
  }

  async provide(): Promise<GeneralFishingLicenseProps> {
    const ships = await this.queryShips()

    return {
      ships,
    }
  }

  onProvideSuccess(
    generalFishingLicense: GeneralFishingLicenseProps,
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: generalFishingLicense,
      status: 'success',
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: 'Failed',
      status: 'failure',
    }
  }

  handleError(error: Error | unknown) {
    Sentry.captureException(error)
    return Promise.reject('Failed to fetch data')
  }
}
