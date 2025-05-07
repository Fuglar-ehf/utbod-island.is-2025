import { CarInfo, IncomeInfo, NameIdentifierValuePair } from '../lib/data-types'

export const mapIncomeToNameValue = (
  income: IncomeInfo[],
): NameIdentifierValuePair[] =>
  income.map((i) => ({
    name: i.employer,
    value: i.income.toLocaleString('is-IS'),
    identifier: i.employerNationalId,
  }))

export const mapCarsToNameValue = (
  cars: CarInfo[],
): NameIdentifierValuePair[] =>
  cars.map((c) => ({
    name: c.registrationNumber,
    value: c.amount.toLocaleString('is-IS'),
    identifier: '',
  }))

// export class TaxReturnDataHelper {
//   static getTaxReturnData(
//     externalData: ExternalData,
//   ): TaxReturnData | undefined {
//     const taxReturnData = getValueViaPath<TaxReturnData>(
//       externalData,
//       'taxReturn.data',
//     )
//     return taxReturnData
//   }
// }
