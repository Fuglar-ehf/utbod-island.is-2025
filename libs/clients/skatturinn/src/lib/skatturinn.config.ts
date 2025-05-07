import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  fetchTimeout: z.number().int(),
  endpoint: z.string(),
})

export const SkatturinnClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'SkatturinnClient',
  schema,
  load: (env) => ({
    fetchTimeout: 10000,
    endpoint: env.required('SKATTURINN_ENDPOINT', 'http://localhost:3001'),
  }),
})
