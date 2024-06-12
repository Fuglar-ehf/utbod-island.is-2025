import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  gqlBasePath: z.string(),
  redis: z.object({
    nodes: z.array(z.string()),
    ssl: z.boolean(),
  }),
})

export const CmsConfig = defineConfig({
  name: 'CmsConfig',
  schema,
  load: (env) => ({
    gqlBasePath: env.required(
      'GRAPHQL_API_ENDPOINT',
      'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master',
    ),
    redis: {
      nodes: env.requiredJSON('REDIS_URL_NODE_01', [
        'localhost:7000',
        'localhost:7001',
        'localhost:7002',
        'localhost:7003',
        'localhost:7004',
        'localhost:7005',
      ]),
      ssl: env.requiredJSON('REDIS_USE_SSL', false),
    },
  }),
})
