import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { NationalRegistryUserApi } from '@island.is/application/types'

const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    orginizationId: SAMGONGUSTOFA_NATIONAL_ID,
  },
  externalDataId: 'payment',
})

interface CurrentVehiclesParameters {
  showOwned?: boolean
  showCoOwned?: boolean
  showOperated?: boolean
}
export const CurrentVehiclesApi = defineTemplateApi<CurrentVehiclesParameters>({
  action: 'currentVehicles',
  externalDataId: 'currentVehicleList',
  namespace: 'VehiclesShared',
  params: {
    showOwned: true,
    showCoOwned: true,
  },
})
