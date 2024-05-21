// eslint-disable-next-line
import { UserProfileScope } from '../../../../../libs/auth/scopes/src/lib/userProfile.scope'
import { json, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { Base, Client, RskProcuring } from '../../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'services-auth-ids-api'> => {
  return service('services-auth-ids-api')
    .namespace('identity-server')
    .image('services-auth-ids-api')
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      PUBLIC_URL: {
        dev: 'https://identity-server.dev01.devland.is/api',
        staging: 'https://identity-server.staging01.devland.is/api',
        prod: 'https://innskra.island.is/api',
      },
      USER_PROFILE_CLIENT_URL: {
        dev: 'http://web-service-portal-api.service-portal.svc.cluster.local',
        staging:
          'http://web-service-portal-api.service-portal.svc.cluster.local',
        prod: 'https://service-portal-api.internal.island.is',
      },
      USER_PROFILE_CLIENT_SCOPE: json([UserProfileScope.read]),
      XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
        dev: 'IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1',
        staging: 'IS-TEST/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
        prod: 'IS/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
      },
      XROAD_NATIONAL_REGISTRY_REDIS_NODES: {
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
      COMPANY_REGISTRY_REDIS_NODES: {
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
      XROAD_RSK_PROCURING_REDIS_NODES: {
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
      COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
      },
      XROAD_TJODSKRA_API_PATH: '/SKRA-Protected/Einstaklingar-v1',
      XROAD_TJODSKRA_MEMBER_CODE: {
        prod: '6503760649',
        dev: '10001',
        staging: '6503760649',
      },
      NOVA_ACCEPT_UNAUTHORIZED: {
        dev: 'true',
        staging: 'false',
        prod: 'false',
      },
      PASSKEY_CORE_RP_ID: 'island.is',
      PASSKEY_CORE_RP_NAME: 'Island.is',
      PASSKEY_CORE_CHALLENGE_TTL_MS: '120000',
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      NOVA_URL: '/k8s/services-auth/NOVA_URL',
      NOVA_USERNAME: '/k8s/services-auth/NOVA_USERNAME',
      NOVA_PASSWORD: '/k8s/services-auth/NOVA_PASSWORD',
      PASSKEY_CORE_ALLOWED_ORIGIN:
        '/k8s/services-auth/PASSKEY_CORE_ALLOWED_ORIGIN',
    })
    .xroad(Base, Client, RskProcuring)
    .readiness('/health/check')
    .liveness('/liveness')
    .db({ name: 'servicesauth', extensions: ['uuid-ossp'] })
    .migrations()
    .seed()
    .resources({
      limits: {
        cpu: '800m',
        memory: '768Mi',
      },
      requests: {
        cpu: '400m',
        memory: '512Mi',
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 15,
    })
}
