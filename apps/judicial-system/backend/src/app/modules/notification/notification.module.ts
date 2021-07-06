import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SmsModule } from '@island.is/nova-sms'
import { EmailModule } from '@island.is/email-service'
import { TranslationsModule } from '@island.is/api/domains/translations'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { CaseModule } from '../case'
import { CourtModule } from '../court'
import { Notification } from './models'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    UserModule,
    CaseModule,
    CourtModule,
    SequelizeModule.forFeature([Notification]),
    TranslationsModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
