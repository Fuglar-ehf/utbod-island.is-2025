import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/icelandic-names-registry-backend/DB_PASSWORD',
}
export const serviceSetup = (): ServiceBuilder<'icelandic-names-registry-backend'> =>
  service('icelandic-names-registry-backend')
    .image('icelandic-names-registry-backend')
    .namespace('icelandic-names-registry')
    .postgres(postgresInfo)
    .initContainer({
      containers: [
        {
          name: 'migrations',
          command: 'npx',
          args: ['sequelize-cli', 'db:migrate'],
        },
        {
          name: 'seeds',
          command: 'npx',
          args: ['sequelize-cli', 'db:seed:all'],
        },
      ],
      postgres: postgresInfo,
    })
    .secrets({
      ALLOWED_NATIONAL_IDS:
        '/k8s/icelandic-names-registry-backend/ALLOWED_NATIONAL_IDS',
    })
    .grantNamespaces('islandis')
    .liveness('/liveness')
    .readiness('/liveness')
