import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environment'

bootstrap({
  appModule: AppModule,
  name: 'bff',
  port: environment.port,
  globalPrefix: `${environment.keyPath}/bff`,
  healthCheck: {
    timeout: 1000,
  },
})
