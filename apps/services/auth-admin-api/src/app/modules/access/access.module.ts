import { Module } from '@nestjs/common'
import { AccessService, AdminAccess } from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([AdminAccess])],
  providers: [AccessService],
})
export class AccessModule {}
