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
    .secrets({
      IDENTITYSERVER_SECRET: '/k8s/auth-admin-web/IDENTITYSERVER_SECRET',
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
            'nginx.ingress.kubernetes.io/client-header-buffer-size': '32k',
            'nginx.ingress.kubernetes.io/large-client-header-buffers': '4 32k',
            'nginx.ingress.kubernetes.io/proxy-buffers-number': '8',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/server-snippet': `|
            client_header_buffer_size 32k;
            large_client_header_buffers 4 32k;`,
          },
          staging: {
            'nginx.ingress.kubernetes.io/client-header-buffer-size': '32k',
            'nginx.ingress.kubernetes.io/large-client-header-buffers': '4 32k',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/server-snippet': `|
            client_header_buffer_size 32k;
            large_client_header_buffers 4 32k;`,
          },
          prod: {
            'nginx.ingress.kubernetes.io/client-header-buffer-size': '32k',
            'nginx.ingress.kubernetes.io/large-client-header-buffers': '4 32k',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/server-snippet': `|
            client_header_buffer_size 32k;
            large_client_header_buffers 4 32k;`,
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
    .readiness('/liveness')
    .liveness('/liveness')
    .extraAttributes({
      dev: { progressDeadlineSeconds: 1200 },
      staging: { progressDeadlineSeconds: 1200 },
      prod: { progressDeadlineSeconds: 1200 },
    })
}
