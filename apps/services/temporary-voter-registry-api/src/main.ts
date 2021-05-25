import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'services-temporary-voter-registry-api',
  openApi,
  port: 4247,
  swaggerPath: '',
})
