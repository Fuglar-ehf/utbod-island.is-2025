import { CacheModule as NestCacheModule, DynamicModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-ioredis'
import { createNestJSCache } from '@island.is/cache'
import { environment } from '../../../environments'

const { redis, production } = environment
let CacheModule: DynamicModule

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CacheModule = NestCacheModule.register()
} else {
  CacheModule = NestCacheModule.register({
    store: redisStore,
    redisInstance: createNestJSCache({
      name: 'air_discount_scheme_backend_service_cache',
      ssl: production,
      nodes: redis.urls,
    }),
  })
}

export { CacheModule }
