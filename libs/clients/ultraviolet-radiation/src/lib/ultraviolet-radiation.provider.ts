import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import {
  buildCacheControl,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { Configuration, DefaultApi } from '../../gen/fetch'
import { UltravioletRadiationClientConfig } from './ultraviolet-radiation.config'
import { caching } from 'cache-manager'
import { createRedisCacheManager } from '@island.is/cache'

const getCacheManager = (
  config: ConfigType<typeof UltravioletRadiationClientConfig>,
  ttl: number,
) => {
  if (config.redis.nodes.length === 0) {
    return caching('memory', {
      ttl,
    })
  }

  return createRedisCacheManager({
    name: 'clients-ultraviolet-radiation',
    nodes: config.redis.nodes,
    ssl: config.redis.ssl,
    noPrefix: true,
    ttl,
  })
}

const fetchFactory = async (
  config: ConfigType<typeof UltravioletRadiationClientConfig>,
  ttl: number,
) => {
  return new Configuration({
    headers: {
      'x-api-key': config.apiKey,
      Accept: 'application/json',
    },
    fetchApi: createEnhancedFetch({
      name: 'clients-ultraviolet-radiation',
      organizationSlug: 'geislavarnir-rikisins',
      cache: {
        cacheManager: await getCacheManager(config, ttl),
        overrideCacheControl: () =>
          buildCacheControl({
            maxAge: ttl / 1000, // Convert milliseconds to seconds
            staleWhileRevalidate: 3600 * 24 * 14, // 14 days
            staleIfError: 3600 * 24 * 30, // 1 month
          }),
      },
    }),
  })
}

export const ApiLatestMeasurementConfig = {
  provide: 'UltravioletRadiationClientLatestMeasurementConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof UltravioletRadiationClientConfig>) =>
    fetchFactory(
      config,
      15 * 60 * 1000, // 15 minutes
    ),
  inject: [UltravioletRadiationClientConfig.KEY],
}

export const ApiMeasurementSeriesConfig = {
  provide: 'UltravioletRadiationClientMeasurementSeriesConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof UltravioletRadiationClientConfig>) =>
    fetchFactory(
      config,
      60 * 60 * 1000, // 1 hour
    ),
  inject: [UltravioletRadiationClientConfig.KEY],
}

export const DefaultApiWithLatestMeasurementCache =
  'DefaultApiWithLatestMeasurementCache'
export const DefaultApiWithMeasurementSeriesCache =
  'DefaultApiWithMeasurementSeriesCache'

export const ApiProviders = [
  {
    provide: DefaultApiWithLatestMeasurementCache,
    useFactory: (config: Configuration) => new DefaultApi(config),
    inject: [ApiLatestMeasurementConfig.provide],
  },
  {
    provide: DefaultApiWithMeasurementSeriesCache,
    useFactory: (config: Configuration) => new DefaultApi(config),
    inject: [ApiMeasurementSeriesConfig.provide],
  },
]
