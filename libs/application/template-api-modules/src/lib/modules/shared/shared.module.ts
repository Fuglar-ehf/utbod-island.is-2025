import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailModule } from '@island.is/email-service'
import { BaseTemplateAPIModuleConfig } from '../../types'
import { SharedTemplateApiService } from './shared.service'
import { PaymentModule } from '../../../../../../../apps/application-system/api/src/app/modules/payment/payment.module'

export class SharedTemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    const configuration = () => config

    return {
      module: SharedTemplateAPIModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        EmailModule.register(config.emailOptions),
        PaymentModule.register({
          xRoadPath: config.xRoadBasePathWithEnv,
          ...config.paymentOptions
        }),
      ],
      providers: [SharedTemplateApiService],
      exports: [SharedTemplateApiService],
    }
  }
}
