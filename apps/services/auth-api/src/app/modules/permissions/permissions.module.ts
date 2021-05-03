import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  AccessService,
  ResourcesService,
  ApiScope,
  IdentityResource,
  IdentityResourceUserClaim,
  ApiScopeUserClaim,
  ApiResource,
  ApiResourceUserClaim,
  ApiResourceScope,
  ApiResourceSecret,
  ApiScopeUser,
  ApiScopeUserAccess,
} from '@island.is/auth-api-lib'
import { PermissionsController } from './permissions.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      IdentityResource,
      IdentityResourceUserClaim,
      ApiScope,
      ApiScopeUserClaim,
      ApiResource,
      ApiResourceUserClaim,
      ApiResourceScope,
      ApiResourceSecret,
      ApiScopeUser,
      ApiScopeUserAccess,
    ]),
  ],
  controllers: [PermissionsController],
  providers: [AccessService, ResourcesService],
})
export class PermissionsModule {}
