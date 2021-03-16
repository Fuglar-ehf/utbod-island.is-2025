import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { environment } from '../environments'
import { BackendAPI } from '../services'
import {
  AuthModule,
  UserModule,
  CaseModule,
  FileModule,
  AuditModule,
  InstitutionModule,
  CourtModule,
  FeatureModule,
} from './modules/'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/judicial-system/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
      dataSources: () => ({ backendApi: new BackendAPI() }),
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    AuditTrailModule,
    AuthModule,
    AuditModule,
    UserModule,
    CaseModule,
    FileModule,
    InstitutionModule,
    CourtModule,
    FeatureModule,
  ],
  providers: [BackendAPI],
})
export class AppModule {}
