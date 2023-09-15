import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuditTrailService,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import { AppService } from '../app.service'
import { AppController } from '../app.controller'
import appConfigModule from '../app.config'

export const createTestingAppModule = async () => {
  const appModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [auditTrailModuleConfig, appConfigModule],
      }),
    ],
    controllers: [AppController],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      AuditTrailService,
      AppService,
    ],
  }).compile()

  const appController = appModule.get<AppController>(AppController)

  return appController
}
