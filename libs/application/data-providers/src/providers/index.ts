import { ExpectedDateOfBirth } from './ExpectedDateOfBirth'
import { ExampleFails } from './ExampleFails'
import { ExampleSucceeds } from './ExampleSucceeds'
import { DataProvider, DataProviderTypes } from '@island.is/application/core'

const typeMap = {
  [DataProviderTypes.ExpectedDateOfBirth]: ExpectedDateOfBirth,
  [DataProviderTypes.ExampleFails]: ExampleFails,
  [DataProviderTypes.ExampleSucceeds]: ExampleSucceeds,
}

export function getDataProviderByType(
  type: DataProviderTypes,
): DataProvider | null {
  const Provider = typeMap[type]
  if (Provider) {
    return new Provider()
  }
  return null
}
