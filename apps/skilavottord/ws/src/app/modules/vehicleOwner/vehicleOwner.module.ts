import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerResolver } from './vehicleOwner.resolver'
import { VehicleOwnerService } from './vehicleOwner.service'

@Module({
  imports: [SequelizeModule.forFeature([VehicleOwnerModel])],
  providers: [VehicleOwnerResolver, VehicleOwnerService],
})
export class VehicleOwnerModule {}
