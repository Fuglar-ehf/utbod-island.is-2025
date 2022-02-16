import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './FishingLicenseClientConfig'
import { Configuration } from './gen/fetch'

export const ApiConfiguration = {
  provide: 'FishingLicenseClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-fishing-license',
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.scope,
            }
          : undefined,
      }),
      basePath: `https://veidileyfitest.azurewebsites.net/`, //TODO Change to ${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}/ when fiskistofa api is available on xroad
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    }),
  inject: [
    XRoadConfig.KEY,
    FishingLicenseClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
