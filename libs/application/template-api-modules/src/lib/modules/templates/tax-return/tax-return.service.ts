import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'

import { NotificationsService } from '../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import { Income } from './types'

@Injectable()
export class TaxReturnService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.TAX_RETURN)
  }

  async getIncomeInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<Income[]> {
    return [
      {
        fromNationalId: '1111111111',
        fromName: 'Norðurljós Software ehf',
        amount: 9360000,
      },
      {
        fromNationalId: '2222222222',
        fromName: 'Mús & Merki ehf.',
        amount: 900000,
      },
    ]
  }

  async createApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  async completeApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}
