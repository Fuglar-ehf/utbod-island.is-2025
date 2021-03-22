import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { SmsModule } from '@island.is/nova-sms'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { DataSourceConfig } from 'apollo-datasource'
import environment from '../../environments/environment'
import { EmailModule } from '@island.is/email-service'
import { SmsVerification } from './smsVerification.model'
import { EmailVerification } from './emailVerification.model'
import { VerificationService } from './verification.service'
import { UserProfileInfraController } from './userProfileInfra.controller'
import { SequelizeConfigService } from '../sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmailVerification,
      SmsVerification,
      UserProfile,
    ]),
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
  ],
  controllers: [UserProfileController, UserProfileInfraController],
  providers: [UserProfileService, VerificationService, SequelizeConfigService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
