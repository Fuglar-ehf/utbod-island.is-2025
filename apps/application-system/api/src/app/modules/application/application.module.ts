import { Module } from '@nestjs/common'
import { FileStorageModule } from '@island.is/file-storage'

import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'

import { ApplicationController } from './application.controller'
import { environment } from '../../../environments'

import { ApplicationAccessService } from './tools/applicationAccess.service'

import { LoggingModule } from '@island.is/logging'
import { TemplateApiApplicationService } from './template-api.service'
import { AwsModule } from '@island.is/nest/aws'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ApplicationValidationService } from './tools/applicationTemplateValidation.service'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'
import { ApplicationChargeModule } from './charge/application-charge.module'
import { ApplicationFilesModule } from '@island.is/application/api/files'
import { PaymentModule } from '@island.is/application/api/payment'
import { HistoryModule } from '@island.is/application/api/history'
@Module({
  imports: [
    PaymentModule,
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    TemplateAPIModule.register({
      ...environment.templateApi,
      applicationService: TemplateApiApplicationService,
    }),
    ApplicationApiCoreModule,
    ApplicationFilesModule,
    AwsModule,
    FileStorageModule,
    SigningModule,
    CmsTranslationsModule,
    FeatureFlagModule,
    HistoryModule,
    LoggingModule,
    ApplicationChargeModule,
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationAccessService,
    ApplicationValidationService,
    TemplateApiActionRunner,
  ],
})
export class ApplicationModule {}
