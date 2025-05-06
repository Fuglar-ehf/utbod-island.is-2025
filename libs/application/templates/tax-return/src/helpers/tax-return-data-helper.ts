import { ExternalData } from '@island.is/application/types'
import { TaxReturnData } from '../lib/data-types'
import { getValueViaPath } from '@island.is/application/core'

// TODO: Þarf kannski ekki, sjáum til
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
