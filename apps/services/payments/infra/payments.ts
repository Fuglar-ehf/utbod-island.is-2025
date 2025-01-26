import { service, ServiceBuilder, json } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  ChargeFjsV2,
  RskCompanyInfo,
  NationalRegistryB2C,
} from '../../../../infra/src/dsl/xroad'

const namespace = 'services-payments'
const serviceName = namespace
const imageName = namespace

export const serviceSetup = (): ServiceBuilder<'services-payments'> =>
  service(serviceName)
    .namespace(namespace)
    .image(imageName)
    .db({
      extensions: ['uuid-ossp'],
    })
    .migrations()
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/payments',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      ISLANDIS_URL: {
        dev: 'https://beta.dev01.devland.is',
        staging: 'https://beta.staging01.devland.is',
        prod: 'https://island.is',
      },
      REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379',
        ]),
      },
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-payments/IDENTITY_SERVER_CLIENT_SECRET',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/services-payments/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
      PAYMENTS_TOKEN_SIGNING_SECRET:
        '/k8s/services-payments/PAYMENTS_TOKEN_SIGNING_SECRET',
      PAYMENTS_TOKEN_SIGNING_ALGORITHM:
        '/k8s/services-payments/PAYMENTS_TOKEN_SIGNING_ALGORITHM',
      PAYMENTS_GATEWAY_API_SECRET:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_SECRET',
      PAYMENTS_GATEWAY_API_HEADER_KEY:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_HEADER_KEY',
      PAYMENTS_GATEWAY_API_HEADER_VALUE:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_HEADER_VALUE',
      PAYMENTS_GATEWAY_API_URL:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_URL',
      PAYMENTS_GATEWAY_SYSTEM_CALLING:
        '/k8s/services-payments/PAYMENTS_GATEWAY_SYSTEM_CALLING',
    })
    .xroad(Base, Client, ChargeFjsV2, RskCompanyInfo, NationalRegistryB2C)
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
