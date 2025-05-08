import { ExternalData } from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import {
  Allowance,
  Benefit,
  CarInfo,
  IncomeInfo,
  Mortgage,
  OtherLoan,
  RealestateInfo,
  TaxReturnData,
  UserInfo,
} from '../lib/data-types'

export const getOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  // const user = externalData.getUserInfo.data as UserInfo
  const taxData = externalData.getData.data as TaxReturnData
  const extraCars = answers.carsTableRepeater as Array<any>

  const formatAmount = (n: number) => `${n.toLocaleString('is-IS')} kr.`

  return [
    // Personal information
    // {
    //   title: 'Upplýsingar um þig',
    //   width: 'full' as const,
    //   keyText: 'Nafn',
    //   valueText: user.name,
    // },
    // {
    //   width: 'half' as const,
    //   keyText: 'Kennitala',
    //   valueText: user.nationalId,
    // },
    // {
    //   width: 'half' as const,
    //   keyText: 'Símanúmer',
    //   valueText: user.phoneNumber,
    // },
    // {
    //   width: 'full' as const,
    //   keyText: 'Heimilisfang',
    //   valueText: user.address,
    // },

    // Income
    ...(taxData.income ?? []).flatMap((item: IncomeInfo) => [
      {
        title: 'Tekjur',
        width: 'half' as const,
        keyText: item.employer,
        valueText: formatAmount(item.income),
      },
    ]),

    // Real Estate
    ...(taxData.realestates ?? []).flatMap(
      (estate: RealestateInfo, i: number) => [
        {
          title: i === 0 ? 'Fasteignir' : undefined,
          width: 'full' as const,
          keyText: `${estate.address}`,
          valueText: formatAmount(estate.realastateValue),
        },
      ],
    ),

    // Cars
    ...(taxData.cars ?? []).flatMap((car: CarInfo, i: number) => [
      {
        title: i === 0 ? 'Ökutæki' : undefined,
        width: 'half' as const,
        keyText: `Skráningarnúmer: ${car.registrationNumber}`,
        valueText: formatAmount(car.amount),
      },
    ]),
    ...(extraCars ?? []).flatMap((car, i) => [
      {
        title: i === 0 && !taxData.cars?.length ? 'Ökutæki' : undefined,
        width: 'half' as const,
        keyText: `Skráningarnúmer: ${car.registrationNumber}`,
        valueText: formatAmount(car.amount),
      },
    ]),

    // Mortgages
    ...(taxData.mortgages ?? []).flatMap((mortgage: Mortgage, i: number) => [
      {
        title: i === 0 ? 'Húsnæðislán' : undefined,
        width: 'full' as const,
        keyText: `${mortgage.loanProvider} - ${mortgage.address}`,
        valueText: `Eftirstöðvar: ${formatAmount(mortgage.remaining)}`,
      },
    ]),

    // Other Loans
    ...(taxData.otherLoans ?? []).flatMap((loan: OtherLoan, i: number) => [
      {
        title: i === 0 ? 'Önnur lán' : undefined,
        width: 'full' as const,
        keyText: loan.description,
        valueText: `Eftirstöðvar: ${formatAmount(loan.remaining)}`,
      },
    ]),

    // Benefits
    ...(taxData.benefits ?? []).flatMap((benefit: Benefit, i: number) => [
      {
        title: i === 0 ? 'Styrkir' : undefined,
        width: 'half' as const,
        keyText: `${benefit.name} (${benefit.from})`,
        valueText: formatAmount(benefit.amount),
      },
    ]),

    // Allowances
    ...(taxData.allowances ?? []).flatMap((allowance: Allowance, i: number) => [
      {
        title: i === 0 ? 'Dagpeningar' : undefined,
        width: 'half' as const,
        keyText: `${allowance.name} (${allowance.from})`,
        valueText: formatAmount(allowance.amount),
      },
    ]),
  ]
}
