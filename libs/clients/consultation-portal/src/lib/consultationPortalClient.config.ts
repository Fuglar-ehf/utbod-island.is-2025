import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const ConsultationPortalClientConfig = defineConfig({
  name: 'ConsultationPortalApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'CONSULTATION_PORTAL_CLIENT_BASE_PATH',
        'https://samradapi-test.devland.is',
      ),
    }
  },
})
