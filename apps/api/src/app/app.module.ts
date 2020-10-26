import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CmsModule } from '@island.is/api/domains/cms'
import { ApplicationModule } from '@island.is/api/domains/application'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { DocumentModule } from '@island.is/api/domains/documents'
import { CommunicationsModule } from '@island.is/api/domains/communications'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { HealthController } from './health.controller'
import { environment } from './environments'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = debug ? 'apps/api/src/api.graphql' : true
@Module({
  controllers: [HealthController],
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      plugins: [
        responseCachePlugin({
          shouldReadFromCache: ({
            request: {
              http: { headers },
            },
          }) => {
            const bypassCacheKey = headers.get('bypass-cache-key')
            return bypassCacheKey !== process.env.BYPASS_CACHE_KEY
          },
        }),
      ],
    }),
    ContentSearchModule,
    CmsModule,
    ApplicationModule,
    FileUploadModule,
    DocumentModule,
    TranslationsModule,
    TerminusModule,
    NationalRegistryModule.register({
      baseSoapUrl: environment.nationalRegistry.baseSoapUrl,
      user: environment.nationalRegistry.user,
      password: environment.nationalRegistry.password,
      host: environment.nationalRegistry.host,
    }),
    UserProfileModule.register({
      userProfileServiceBasePath:
        environment.userProfile.userProfileServiceBasePath,
    }),
    CommunicationsModule,
  ],
})
export class AppModule {}
