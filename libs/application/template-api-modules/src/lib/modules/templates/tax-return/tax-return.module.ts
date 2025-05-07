import { Module } from '@nestjs/common'

import {
  NationalRegistryVXClientConfig,
  NationalRegistryVXClientModule,
} from '@island.is/clients/national-registry-vx'
import {
  SkatturinnClientConfig,
  SkatturinnClientModule,
} from '@island.is/clients/skatturinn'
import { ConfigModule } from '@island.is/nest/config'

import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { SharedTemplateAPIModule } from '../../shared'
import { TaxReturnService } from './tax-return.service'

@Module({
  imports: [
    NationalRegistryVXClientModule,
    SkatturinnClientModule,
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [NationalRegistryVXClientConfig, SkatturinnClientConfig],
    }),
  ],
  providers: [TaxReturnService],
  exports: [TaxReturnService],
})
export class TaxReturnModule {}
