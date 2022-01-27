import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/air-discount-scheme/backend/DB_PASSWORD',
  username: 'air_discount_scheme_backend',
  name: 'air_discount_scheme_backend',
}
export const serviceSetup = (): ServiceBuilder<'air-discount-scheme-backend'> =>
  service('air-discount-scheme-backend')
    .image('air-discount-scheme-backend')
    .namespace('air-discount-scheme')
    .secrets({
      SENTRY_DSN: '/k8s/air-discount-scheme-backend/SENTRY_DSN',
      ICELANDAIR_API_KEY: '/k8s/air-discount-scheme/backend/ICELANDAIR_API_KEY',
      ERNIR_API_KEY: '/k8s/air-discount-scheme/backend/ERNIR_API_KEY',
      NORLANDAIR_API_KEY: '/k8s/air-discount-scheme/backend/NORLANDAIR_API_KEY',
      NATIONAL_REGISTRY_PASSWORD:
        '/k8s/air-discount-scheme/backend/NATIONAL_REGISTRY_PASSWORD',
      NATIONAL_REGISTRY_USERNAME:
        '/k8s/air-discount-scheme/backend/NATIONAL_REGISTRY_USERNAME',
      NATIONAL_REGISTRY_URL:
        '/k8s/air-discount-scheme/backend/NATIONAL_REGISTRY_URL',
      VEGAGERDIN_IDS_CLIENTS_SECRET:
        '/k8s/air-discount-scheme-backend/VEGAGERDIN_IDS_CLIENTS_ADS_SECRET',
    })
    .env({
      ENVIRONMENT: {
        dev: 'dev',
        staging: 'staging',
        prod: 'prod',
      },
      REDIS_URL_NODE_01: {
        dev:
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        staging:
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        prod:
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .postgres(postgresInfo)
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .ingress({
      primary: {
        host: {
          dev: ['loftbru', 'loftbru-cf'],
          staging: ['loftbru', 'loftbru-cf'],
          prod: 'loftbru',
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
        paths: ['/api/swagger', '/api/public'],
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
