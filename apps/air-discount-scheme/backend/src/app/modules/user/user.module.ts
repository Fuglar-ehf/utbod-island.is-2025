import { Module } from '@nestjs/common'
import { PublicUserController, PrivateUserController } from './user.controller'
import { UserService } from './user.service'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'
import { NationalRegistryModule as ADSNationalRegistryModule } from '../nationalRegistry'

@Module({
  imports: [DiscountModule, FlightModule, ADSNationalRegistryModule],
  controllers: [PublicUserController, PrivateUserController],
  providers: [UserService],
})
export class UserModule {}
