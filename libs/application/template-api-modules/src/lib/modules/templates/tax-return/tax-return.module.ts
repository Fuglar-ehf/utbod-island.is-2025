import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { TaxReturnService } from './tax-return.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [TaxReturnService],
  exports: [TaxReturnService],
})
export class TaxReturnModule {}
