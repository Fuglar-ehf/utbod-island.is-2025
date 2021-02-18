import { DynamicModule } from '@nestjs/common'

import { HealthInsuranceResolver } from './graphql'
import { BucketService } from './bucket.service'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
  SoapClient,
} from './soap'

export class HealthInsuranceModule {
  static register(config: HealthInsuranceConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      providers: [
        BucketService,
        HealthInsuranceService,
        HealthInsuranceResolver,
        SoapClient,
        HealthInsuranceAPI,
        {
          provide: HEALTH_INSURANCE_CONFIG,
          useValue: config,
        },
      ],
      exports: [],
    }
  }
}
