import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { DigitalTachographDriversCardService } from './digital-tachograph-drivers-card.service'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

export class DigitalTachographDriversCardModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DigitalTachographDriversCardModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DigitalTachographDriversCardClientModule,
        DrivingLicenseApiModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [DigitalTachographDriversCardClientConfig],
        }),
      ],
      providers: [DigitalTachographDriversCardService],
      exports: [DigitalTachographDriversCardService],
    }
  }
}
