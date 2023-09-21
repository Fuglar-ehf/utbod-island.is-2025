import { forwardRef, Module } from '@nestjs/common'

import { CourtClientModule } from '@island.is/judicial-system/court-client'
import { EmailModule } from '@island.is/email-service'

import { environment } from '../../../environments'
import { EventModule } from '../index'
import { CourtService } from './court.service'

@Module({
  imports: [
    CourtClientModule,
    EmailModule.register(environment.emailOptions),
    forwardRef(() => EventModule),
  ],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
