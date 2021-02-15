import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class PendingApplications extends BasicDataProvider {
  type = 'PendingApplications'

  provide(application: Application): Promise<string> {
    const query = `query HealthInsuranceGetPendingApplication {
      healthInsuranceGetPendingApplication 
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(
          response.data?.healthInsuranceGetPendingApplication,
        )
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  handleError(error: any) {
    console.log('Provider error - PendingApplications:', error)
    return Promise.resolve(error)
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
