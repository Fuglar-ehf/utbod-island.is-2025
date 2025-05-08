import { Injectable } from '@nestjs/common'

import { getValueViaPath } from '@island.is/application/core'
import { ApplicationTypes } from '@island.is/application/types'
import { NationalRegistryVXClientService } from '@island.is/clients/national-registry-vx'
import { SkatturinnClientService } from '@island.is/clients/skatturinn'

import { NotificationsService } from '../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import { CarItem, SalaryItem } from './answer-types'
import { TaxReturnData, UserInfo } from './types'

@Injectable()
export class TaxReturnService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly nationalRegistryService: NationalRegistryVXClientService,
    private readonly taxReturnService: SkatturinnClientService,
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

    const mortgages = [
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

    const otherLoans = [
      {
        description: 'Eftirstöðvar á korti númer: 4469 88XX XXXX 4567',
        interest: 39200,
        remaining: 217000,
      },
      {
        description: 'Aukalán',
        interest: 86000,
        remaining: 980000,
      },
      {
        description: '0142-26-732645 Varðan',
        interest: 14500,
        remaining: 62000,
      },
      {
        description: 'Kílómetragjald, Skatturinn',
        interest: 0,
        remaining: 2370,
      },
      {
        description: 'Þing- og sveitarsjóðsgjöld, Skatturinn',
        interest: 224,
        remaining: 0,
      },
    ]

    const benefits = [
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

    const allowances = [
      {
        from: 'Norðurljós Software ehf',
        amount: 120000,
        name: 'Dagpeningar',
        typeOfBenefit: '2.2',
      },
    ]
    return {
      income,
      cars,
      realestates,
      mortgages,
      otherLoans,
      allowances,
      benefits,
    }
  }

  async getUserInfo({ auth }: TemplateApiModuleActionProps): Promise<UserInfo> {
    const person = await this.nationalRegistryService.getPerson(auth)

    return {
      nationalId: person.nationalId,
      name: person.name,
      address: person.dativeCaseAddress,
      email: 'jokull.thordarson@email.is',
      phoneNumber: '7728391',
    }
  }

  async submitTaxReturn({ application, auth }: TemplateApiModuleActionProps) {
    const externalData = application.externalData?.getData
      ?.data as TaxReturnData

    const externalDataIncome = externalData.income.map((i) => ({
      employerNationalId: i.employerNationalId,
      employer: i.employer,
      income: i.income,
    }))

    const userInputIncome =
      getValueViaPath<Array<SalaryItem>>(
        application.answers,
        'salariesTableRepeater',
      )?.map((s) => ({
        employerNationalId: s.nationalIdWithName.nationalId,
        employer: s.nationalIdWithName.name,
        income: parseInt(s.input.replace(/\./g, '').replace(/,/g, '')),
      })) ?? []

    const externalDataCars = externalData.cars.map((c) => ({
      yearBought: c.yearBought,
      registrationNumber: c.registrationNumber,
      amount: c.amount,
    }))

    const userInputCars =
      getValueViaPath<Array<CarItem>>(
        application.answers,
        'carsTableRepeater',
      )?.map((s) => ({
        yearBought: parseInt(s.year, 10),
        registrationNumber: s.licence,
        amount: parseInt(s.amount.replace(/\./g, '').replace(/,/g, '')),
      })) ?? []

    const dto = {
      nationalid: auth.nationalId,
      year: new Date().getFullYear().toString(), //todo
      income: [...externalDataIncome, ...userInputIncome],
      cars: [...externalDataCars, ...userInputCars],
      realestates: externalData.realestates.map((r) => ({
        address: r.address,
        registrationNumber: r.registrationNumber,
        realastateValue: r.realastateValue,
      })),
      mortgages: externalData.mortgages.map((l) => ({
        yearBought: l.yearBought,
        date: l.date.toString(), //todo
        amount: l.principal, //todo
        address: l.address,
        loanId: l.loanId,
        periodOfLoan: l.periodOfLoan,
        loanProvider: l.loanProvider,
        loanProviderNationalId: l.loanProviderNationalId,
        principal: l.principal,
        interest: l.interest,
        remaining: l.remaining,
      })),
      otherLoans: externalData.otherLoans.map((b) => ({
        loanDescription: b.description,
        interest: b.interest,
        remaining: b.remaining,
        loanProviderNationalId: '',
      })),
      allowances: externalData.allowances.map((b) => ({
        amount: b.amount,
        typeOfAllowance: '',
      })),
      benefits: externalData.benefits.map((b) => ({
        payerNationalId: b.from,
        payerName: b.name,
        amount: b.amount,
        typeOfBenefit: '',
      })),
    }

    await this.taxReturnService.submitTaxReturn(auth, dto)
  }
}
