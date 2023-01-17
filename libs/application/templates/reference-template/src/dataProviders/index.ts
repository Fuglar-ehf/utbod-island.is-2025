import { defineTemplateApi } from '@island.is/application/types'
import { MockProviderApi } from '@island.is/application/types'
export interface MyParameterType {
  id: number
}

export const ReferenceDataApi = defineTemplateApi<MyParameterType>({
  action: 'getReferenceData',
  params: {
    id: 12,
  },
})

export const runsFirst = defineTemplateApi({
  action: 'actionName',
  order: 1, // runs first
})

export const EphemiralApi = defineTemplateApi({
  action: 'getAnotherReferenceData',
  shouldPersistToExternalData: false,
})

export const MyMockProvider = MockProviderApi.configure({
  externalDataId: 'referenceMock',
  params: {
    mocked: true,
    mockObject: {
      mockString: 'This is a mocked string',
      mockArray: ['Need to mock providers?', 'Use this handy templateApi'],
    },
  },
})

export interface MyParameterType {
  id: number
}
