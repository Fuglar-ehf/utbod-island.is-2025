import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration, TaxReturnDataApi } from '../../gen/fetch'
import { SkatturinnClientConfig } from './skatturinn.config'

export const ApiConfigWithIdsAuth = {
  provide: 'SkatturinnClientProviderConfigurationWithIdsAuth',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SkatturinnClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-skatturinn',
        organizationSlug: 'skatturinn',
        timeout: config.fetchTimeout,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: [],
            }
          : undefined,
      }),
      basePath: `${config.endpoint}`,
    }),
  inject: [XRoadConfig.KEY, SkatturinnClientConfig.KEY, IdsClientConfig.KEY],
}

export const exportedApis = [
  {
    provide: TaxReturnDataApi,
    useFactory: (configuration: Configuration) => {
      return new TaxReturnDataApi(configuration)
    },
    inject: [ApiConfigWithIdsAuth.provide],
  },
]
