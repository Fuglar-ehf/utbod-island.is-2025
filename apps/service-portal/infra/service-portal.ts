import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {}): ServiceBuilder<'service-portal'> =>
  service('service-portal')
    .namespace('service-portal')
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 5,
      max: 30,
      min: 5,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .env({
      BASEPATH: '/minarsidur',
      SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .secrets({
      SI_PUBLIC_CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        extraAnnotations: {
          dev: {},
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
        paths: ['/minarsidur'],
      },
    })
