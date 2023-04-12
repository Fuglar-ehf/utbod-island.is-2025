import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SAMGONGUSTOFA_NATIONAL_ID,
  },
  externalDataId: 'payment',
})

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithOwnerchangeChecks',
  externalDataId: 'currentVehicleList',
})

export const InsuranceCompaniesApi = defineTemplateApi({
  action: 'getInsuranceCompanyList',
  externalDataId: 'insuranceCompanyList',
})
