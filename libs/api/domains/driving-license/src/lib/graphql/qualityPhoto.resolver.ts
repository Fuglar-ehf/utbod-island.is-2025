import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseService } from '../drivingLicense.service'
export * from '@island.is/nest/audit'
import { QualityPhoto } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(QualityPhoto)
export class QualityPhotoResolver {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {}

  @ResolveField('dataUri', () => String, { nullable: true })
  resolveDataUri(
    @Parent() { hasQualityPhoto }: QualityPhoto,
    @CurrentUser() user: User,
  ): Promise<String | null> {
    return hasQualityPhoto
      ? this.drivingLicenseService.getQualityPhotoUri(user.nationalId)
      : Promise.resolve(null)
  }

  @Query(() => QualityPhoto)
  drivingLicenseQualityPhoto(@CurrentUser() user: User) {
    return this.drivingLicenseService.getQualityPhoto(user.nationalId)
  }
}
