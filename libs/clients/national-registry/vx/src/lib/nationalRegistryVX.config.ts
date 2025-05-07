import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  fetchTimeout: z.number().int(),
  endpoint: z.string(),
})

export const NationalRegistryVXClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'NationalRegistryVXClient',
  schema,
  load: (env) => ({
    fetchTimeout: 10000,
    endpoint: env.required(
      'NATIONAL_REGISTRY_X_ENDPOINT',
      'http://localhost:3000/national-registry',
    ),
  }),
})
