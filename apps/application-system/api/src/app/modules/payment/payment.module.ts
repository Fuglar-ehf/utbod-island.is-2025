import { DynamicModule } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { AuditModule } from '@island.is/nest/audit'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'

import { Payment } from './payment.model'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { environment } from '../../../environments'
import {
  PAYMENT_CONFIG,
  PaymentServiceOptions,
  PaymentConfig,
} from './payment.configuration'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
}

export class PaymentModule {
  static register(config?: PaymentServiceOptions): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentService,
        {
          provide: PAYMENT_CONFIG,
          useValue: environment.templateApi.paymentOptions as PaymentConfig,
        },
      ],
      imports: [
        AuditModule.forRoot(environment.audit),
        SequelizeModule.forFeature([Payment]),
        ApiDomainsPaymentModule.register(config as PaymentServiceOptions),
        TranslationsModule,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    }
  }
}
