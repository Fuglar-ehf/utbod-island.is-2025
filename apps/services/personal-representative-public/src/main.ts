import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { environment } from './environments'

bootstrap({
  appModule: AppModule,
  name: 'personal-representative-public',
  openApi,
  swaggerPath: '',
  port: environment.port,
})
