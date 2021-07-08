import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/services-documents/DB_PASSWORD',
}

export const serviceSetup = (): ServiceBuilder<'services-documents'> =>
  service('services-documents')
    .image('services-documents')
    .namespace('services-documents')
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .postgres(postgresInfo)
    .grantNamespaces('islandis', 'application-system')
