import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'api'>
}): ServiceBuilder<'consultation-portal'> => {
  const consultationService = service('consultation-portal')
  consultationService
    .image('consultation-portal')
    .namespace('consultation-portal')
    .liveness('/liveness')
    .readiness('/liveness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .env({
      BASEPATH: '/consultation-portal',
      ENVIRONMENT: ref((h) => h.env.type),
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
      IDENTITY_SERVER_ISSUER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is',
      },
      NEXTAUTH_URL: {
        dev: 'https://beta.dev01.devland.is/samradsgatt/api/auth',
        staging: 'https://staging.staging01.devland.is/samradsgatt/api/auth',
        prod: 'https://island.is/samradsgatt/api/auth',
      },
    })
    .secrets({
      DD_RUM_APPLICATION_ID: '/k8s/DD_RUM_APPLICATION_ID',
      DD_RUM_CLIENT_TOKEN: '/k8s/DD_RUM_CLIENT_TOKEN',
      IDENTITY_SERVER_SECRET: '/k8s/consultation-portal/IDENTITY_SERVER_SECRET',
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/samradsgatt'],
      },
    })
  return consultationService
}
