import { Module } from '@nestjs/common'

import {
  NationalRegistryVXClientConfig,
  NationalRegistryVXClientModule,
} from '@island.is/clients/national-registry-vx'
import { ConfigModule } from '@island.is/nest/config'

import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { SharedTemplateAPIModule } from '../../shared'
import { TaxReturnService } from './tax-return.service'

@Module({
  imports: [
    NationalRegistryVXClientModule,
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [NationalRegistryVXClientConfig],
    }),
  ],
  providers: [TaxReturnService],
  exports: [TaxReturnService],
})
export class TaxReturnModule {}
