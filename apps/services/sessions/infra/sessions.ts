import { PersistentVolumeClaim } from '../../../../infra/src/dsl/types/input-types'
import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const namespace = 'services-sessions'
const imageName = 'services-sessions'

export const serviceSetup = (): ServiceBuilder<'services-sessions'> =>
  service('services-sessions')
    .namespace(namespace)
    .image(imageName)
    .redis()
    .db({
      readOnly: true,
      extensions: ['uuid-ossp'],
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      REDIS_USE_SSL: 'true',
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .replicaCount({
      default: 1,
      min: 1,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '250m',
        memory: '512Mi',
      },
      requests: {
        cpu: '25m',
        memory: '300Mi',
      },
    })
    .ingress({
      internal: {
        host: {
          dev: 'sessions-api',
          staging: 'sessions-api',
          prod: 'sessions-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal', 'islandis', 'identity-server')

export const workerSetup = (): ServiceBuilder<'services-sessions-worker'> =>
  service('services-sessions-worker')
    .image(imageName)
    .namespace(namespace)
    .redis()
    .serviceAccount('sessions-worker')
    .command('node')
    .args('main.js', '--job=worker')
    .db({
      extensions: ['uuid-ossp'],
      readOnly: false,
    })
    .migrations()
    .liveness('/liveness')
    .readiness('/liveness')
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      REDIS_USE_SSL: 'true',
    })
