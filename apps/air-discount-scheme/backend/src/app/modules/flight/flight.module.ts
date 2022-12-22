import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Flight, FlightLeg } from './flight.model'
import {
  PublicFlightController,
  PrivateFlightController,
} from './flight.controller'
import { FlightService } from './flight.service'
import { DiscountModule } from '../discount'
import { NationalRegistryModule } from '../nationalRegistry'
import { CacheModule } from '../cache'
import { ExplicitCode } from '../discount/discount.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Flight, FlightLeg, ExplicitCode]),
    forwardRef(() => DiscountModule),
    NationalRegistryModule,
    CacheModule,
  ],
  controllers: [PublicFlightController, PrivateFlightController],
  providers: [FlightService],
  exports: [FlightService],
})
export class FlightModule {}
