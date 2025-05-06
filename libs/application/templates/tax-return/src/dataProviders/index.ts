import { defineTemplateApi } from '@island.is/application/types'

export const IncomeInfoApi = defineTemplateApi({
  action: 'getIncomeInfo',
  externalDataId: 'getIncomeInfo',
  namespace: 'TaxReturnService',
})
