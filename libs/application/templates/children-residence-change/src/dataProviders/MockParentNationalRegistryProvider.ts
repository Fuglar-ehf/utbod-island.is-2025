import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { CRCApplication, DataProviderTypes } from '../types'

/** This is a temporary mock provider for children residence change. National registry team are setting up real provider which we will connect to once it is up. **/
export class MockParentNationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.MOCK_ParentNationalRegistry

  async provide(application: Application): Promise<PersonResidenceChange> {
    const crcApplication = (application as unknown) as CRCApplication
    const data = crcApplication.answers?.mockData?.parentNationalRegistry?.data
    if (!data) {
      throw new Error('Ekki tókst að ná í gögn')
    }
    if (!data.ssn || data.ssn === '') {
      throw new Error('Kennitölu vantar')
    }
    return data
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(
    result: PersonResidenceChange,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
