import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

//import { UserModule, CarModule, RecyclingPartner } from './modules'
import { RecyclingPartnerModule } from './modules/recyclingPartner'
import { AuthModule } from './modules/auth'
//import { UserModule } from './modules/user'
import { UserModule } from './modules'
import { CarownerModule } from './modules/carowner'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/skilavottord/ws/src/app/api.graphql',
      path: '/api/graphql',
    }),
    AuthModule,
    UserModule,
    CarownerModule,
    RecyclingPartnerModule,
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
