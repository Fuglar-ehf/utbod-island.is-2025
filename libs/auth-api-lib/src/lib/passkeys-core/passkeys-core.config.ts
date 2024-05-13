import { defineConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { z } from 'zod'

const PasskeysCoreModuleSchema = z.object({
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
  passkey: z.object({
    rpId: z.string(),
    rpName: z.string(),
    allowedOrigin: z.string(),
    challengeTtl: z.number(),
  }),
})

export const PasskeysCoreConfig = defineConfig({
  name: 'PasskeysCoreModuleCache',
  schema: PasskeysCoreModuleSchema,
  load: (env) => {
    const config: z.infer<typeof PasskeysCoreModuleSchema> = {
      redis: {
        nodes: env.requiredJSON('REDIS_URL_NODE_01', [
          'localhost:7000',
          'localhost:7001',
          'localhost:7002',
          'localhost:7003',
          'localhost:7004',
          'localhost:7005',
        ]),
        ssl: !isRunningOnEnvironment('local'),
      },
      passkey: {
        rpId: env.required('PASSKEY_CORE_RP_ID', 'localhost'),
        rpName: env.required('PASSKEY_CORE_RP_NAME', 'Island.is'),
        allowedOrigin: env.required(
          'PASSKEY_CORE_ALLOWED_ORIGIN',
          'http://localhost:4200',
        ),
        challengeTtl: Number(
          env.required(
            'PASSKEY_CORE_CHALLENGE_TTL_MS',
            (2 * 60 * 1000).toString(),
          ),
        ),
      },
    }

    return config
  },
})
