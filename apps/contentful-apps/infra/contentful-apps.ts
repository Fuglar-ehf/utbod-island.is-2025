import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
export const serviceSetup = (): ServiceBuilder<'contentful-apps'> =>
  service('contentful-apps')
    .image('contentful-apps')
    .namespace('contentful-apps')
    .secrets({
      MIDEIND_TRANSLATION_API_KEY:
        '/k8s/contentful-apps/MIDEIND_TRANSLATION_API_KEY',
    })
    .serviceAccount('contentful-apps')
    .ingress({
      primary: {
        host: {
          dev: 'contentful-apps',
          staging: 'contentful-apps',
          prod: 'contentful-apps',
        },
        paths: ['/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {},
          prod: {},
        },
      },
    })
    .replicaCount({
      default: 1,
      min: 1,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '50m',
        memory: '128Mi',
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
