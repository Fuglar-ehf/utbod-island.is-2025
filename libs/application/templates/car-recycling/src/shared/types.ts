import { VehicleMiniDto } from '@island.is/clients/vehicles'

export interface VehicleDto extends VehicleMiniDto {
  mileage: string
}
