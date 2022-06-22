import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export class DeathNoticeProvider extends BasicDataProvider {
  type = 'DeathNoticeProvider'

  // Note:
  // This provider acts as a barrier to persons with no
  // relevant estates and is reliant on the
  // meta.onEntry for the initial state
  async provide(application: Application): Promise<boolean> {
    const applicationData: any =
      application.externalData?.syslumennOnEntry?.data
    if (
      !applicationData?.estate?.caseNumber?.length ||
      applicationData.estate?.caseNumber.length === 0
    ) {
      return Promise.reject({
        message: m.dataCollectionNoEstatesError,
      })
    }
    return true
  }

  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }

  onProvideSuccess(result: any): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
