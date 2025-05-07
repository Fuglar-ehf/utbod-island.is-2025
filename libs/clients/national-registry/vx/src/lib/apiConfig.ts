import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration, PeopleApi } from '../../gen/fetch'
import { NationalRegistryVXClientConfig } from './nationalRegistryVX.config'

export const ApiConfigWithIdsAuth = {
  provide:
    'NationalRegistryV3ApplicationsClientProviderConfigurationWithIdsAuth',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryVXClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-vx',
        organizationSlug: 'thjodskra',
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
  inject: [
    XRoadConfig.KEY,
    NationalRegistryVXClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}

export const exportedApis = [
  {
    provide: PeopleApi,
    useFactory: (configuration: Configuration) => {
      return new PeopleApi(configuration)
    },
    inject: [ApiConfigWithIdsAuth.provide],
  },
]
