import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import * as firebaseAdmin from 'firebase-admin'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { EmailModule } from '@island.is/email-service'
import { LoggingModule } from '@island.is/logging'
import { QueueModule } from '@island.is/message-queue'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { type ConfigType } from '@island.is/nest/config'
import { UserNotificationsConfig } from '../../../config'
import { FIREBASE_PROVIDER } from '../../../constants'
import { environment } from '../../../environments/environment'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { MeNotificationsController } from './me-notifications.controller'
import { Notification } from './notification.model'
import { NotificationDispatchService } from './notificationDispatch.service'
import { NotificationsWorkerService } from './notificationsWorker/notificationsWorker.service'
import { MessageProcessorService } from './messageProcessor.service'
import { CmsModule } from '@island.is/clients/cms'

@Module({
  exports: [NotificationsService],
  imports: [
    SequelizeModule.forFeature([Notification]),
    LoggingModule,
    CmsTranslationsModule,
    QueueModule.register({
      client: environment.sqsConfig,
      queue: {
        name: 'notifications',
        queueName: environment.mainQueueName,
        deadLetterQueue: {
          queueName: environment.deadLetterQueueName,
        },
      },
    }),
    UserProfileClientModule,
    EmailModule.register(environment.emailOptions),
    FeatureFlagModule,
    NationalRegistryV3ClientModule,
    AuthDelegationApiClientModule,
    CmsModule,
  ],
  controllers: [NotificationsController, MeNotificationsController],
  providers: [
    NotificationsService,
    NotificationDispatchService,
    NotificationsWorkerService,
    MessageProcessorService,
    {
      provide: FIREBASE_PROVIDER,
      useFactory: (config: ConfigType<typeof UserNotificationsConfig>) =>
        process.env.INIT_SCHEMA === 'true'
          ? {}
          : firebaseAdmin.initializeApp({
              credential: firebaseAdmin.credential.cert(
                JSON.parse(config.firebaseCredentials),
              ),
            }),
      inject: [UserNotificationsConfig.KEY],
    },
  ],
})
export class NotificationsModule {}
