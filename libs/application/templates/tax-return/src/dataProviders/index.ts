import { defineTemplateApi } from '@island.is/application/types'

export const TaxDataApi = defineTemplateApi({
  action: 'getData',
  externalDataId: 'getData',
  namespace: 'TaxReturn',
})

export const TaxSubmitApi = defineTemplateApi({
  action: 'submitTaxReturn',
  externalDataId: 'submitTaxReturn',
  shouldPersistToExternalData: true,
  throwOnError: true,
})

export const UserInfoApi = defineTemplateApi({
  action: 'getUserInfo',
  externalDataId: 'getUserInfo',
  namespace: 'TaxReturn',
})
