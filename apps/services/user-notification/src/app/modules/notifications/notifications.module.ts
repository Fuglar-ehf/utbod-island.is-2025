import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigType } from '@nestjs/config'
import * as firebaseAdmin from 'firebase-admin'

import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { EmailModule } from '@island.is/email-service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { LoggingModule } from '@island.is/logging'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { QueueModule } from '@island.is/message-queue'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'

import { NotificationsController } from './notifications.controller'
import { environment } from '../../../environments/environment'
import { FIREBASE_PROVIDER } from '../../../constants'
import { NotificationsService } from './notifications.service'
import { MeNotificationsController } from './me-notifications.controller'
import { Notification } from './notification.model'
import { UserNotificationsInfraController } from './infra.controller'
import { NotificationDispatchService } from './notificationDispatch.service'
import {
  IS_RUNNING_AS_WORKER,
  NotificationsWorkerService,
  SERVICE_PORTAL_CLICK_ACTION_URL,
} from './notificationsWorker/notificationsWorker.service'
import {
  APP_PROTOCOL,
  MessageProcessorService,
} from './messageProcessor.service'
import { UserNotificationsConfig } from '../../../config'

@Module({
  exports: [NotificationsService],
  imports: [
    SequelizeModule.forFeature([Notification]),
    CacheModule.register({
      ttl: 60 * 10 * 1000, // 10 minutes
      max: 100, // 100 items max
    }),
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
  ],
  controllers: [
    NotificationsController,
    MeNotificationsController,
    UserNotificationsInfraController,
  ],
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
    {
      provide: IS_RUNNING_AS_WORKER,
      useFactory: (config: ConfigType<typeof UserNotificationsConfig>) =>
        config.isWorker,
      inject: [UserNotificationsConfig.KEY],
    },
    {
      provide: APP_PROTOCOL,
      useFactory: (config: ConfigType<typeof UserNotificationsConfig>) =>
        config.appProtocol,
      inject: [UserNotificationsConfig.KEY],
    },
    {
      provide: SERVICE_PORTAL_CLICK_ACTION_URL,
      useFactory: (config: ConfigType<typeof UserNotificationsConfig>) =>
        config.servicePortalClickActionUrl,
      inject: [UserNotificationsConfig.KEY],
    },
  ],
})
export class NotificationsModule {}
