import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'

import { NotificationsService } from '../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import { TaxReturnData, UserInfo } from './types'

@Injectable()
export class TaxReturnService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.TAX_RETURN)
  }

  async getData({
    auth,
  }: TemplateApiModuleActionProps): Promise<TaxReturnData> {
    const income = [
      {
        employerNationalId: '1111111111',
        employer: 'Norðurljós Software ehf',
        income: 9360000,
      },
      {
        employerNationalId: '2222222222',
        employer: 'Mús & Merki ehf.',
        income: 900000,
      },
    ]

    const cars = [
      { yearBought: 2021, registrationNumber: 'KB-521', amount: 3100000 },
      { yearBought: 2012, registrationNumber: 'JU-329', amount: 430000 },
    ]

    const realestates = [
      {
        address: 'Bláfjallagata 12',
        registrationNumber: '210-9876',
        realastateValue: 52000000,
      },
    ]

    const loans = [
      {
        yearBought: 2021,
        date: new Date('2020-01-01'),
        amount: 20000000,
        address: 'Bláfjallagata 12',
        loanId: '56783900123',
        periodOfLoan: 30,
        loanProvider: 'Íslandsbanki hf.',
        loanProviderNationalId: '4910080160',
        principal: 1360000,
        interest: 920000,
        remaining: 28540000,
      },
    ]

    const benefits = [
      {
        from: 'Norðurljós Software ehf',
        amount: 120000,
        name: 'Dagpeningar',
        typeOfBenefit: '2.2',
      },
      {
        from: 'Norðurljós Software ehf',
        amount: 75000,
        name: 'Íþróttastyrkur',
        typeOfBenefit: '2.3',
      },
      {
        from: 'VR',
        amount: 130000,
        name: 'Starfsmenntastyrkur',
        typeOfBenefit: '2.3',
      },
    ]

    return {
      income,
      cars,
      realestates,
      loans,
      benefits,
    }
  }

  async getUserInfo({ auth }: TemplateApiModuleActionProps): Promise<UserInfo> {
    return {
      nationalId: '1203894569',
      name: 'Jökull Þórðarson',
      address: 'Bláfjallagata 12, 105 Reykjavík',
      email: 'jokull.thordarson@email.is',
      phoneNumber: '7728391',
    }
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
