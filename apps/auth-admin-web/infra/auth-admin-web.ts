import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'auth-admin-web'> => {
  return service('auth-admin-web')
    .namespace('identity-server-admin')
    .image('auth-admin-web')
    .env({
      NEXT_PUBLIC_BACKEND_URL: '/backend',
      IDENTITYSERVER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is',
      },
      BASE_URL: {
        dev: 'https://identity-server.dev01.devland.is/admin',
        staging: 'https://identity-server.staging01.devland.is/admin',
        prod: 'https://innskra.island.is/admin',
      },
      NEXTAUTH_URL: {
        dev: 'https://identity-server.dev01.devland.is/admin/api/auth',
        staging: 'https://identity-server.staging01.devland.is/admin/api/auth',
        prod: 'https://innskra.island.is/admin/api/auth',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server',
          staging: 'identity-server',
          prod: 'innskra.island.is',
        },
        paths: ['/admin'],
        public: true,
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
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '256Mi',
      },
      requests: {
        cpu: '200m',
        memory: '128Mi',
      },
    })
    .targetPort(4200)
    .readiness('/liveness')
    .liveness('/liveness')
}
