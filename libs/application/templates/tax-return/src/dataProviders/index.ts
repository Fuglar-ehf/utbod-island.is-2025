import { defineTemplateApi } from '@island.is/application/types'

export const TaxDataApi = defineTemplateApi({
  action: 'getData',
  externalDataId: 'getData',
  namespace: 'TaxReturn',
})
