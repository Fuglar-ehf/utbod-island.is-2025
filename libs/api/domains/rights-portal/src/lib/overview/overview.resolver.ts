import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Inject, UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { User } from '@island.is/auth-nest-tools'
import { OverviewService } from './overview.service'
import { InsuranceConfirmation } from './models/insuranceConfirmation.model'
import { InsuranceOverview } from './models/insuranceOverview.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@FeatureFlag(Features.servicePortalHealthOverviewPage)
@Audit({ namespace: '@island.is/api/rights-portal/overview' })
@Scopes(ApiScope.healthRightsStatus)
export class OverviewResolver {
  constructor(private readonly service: OverviewService) {}

  @Query(() => InsuranceConfirmation, {
    name: 'rightsPortalInsuranceConfirmation',
  })
  @Audit()
  getInsuranceConfirmation(
    @CurrentUser() user: User,
  ): Promise<InsuranceConfirmation | null> {
    return this.service.getInsuranceConfirmation(user)
  }

  @Query(() => InsuranceOverview, {
    name: 'rightsPortalInsuranceOverview',
  })
  @Audit()
  getInsuranceOverview(
    @CurrentUser() user: User,
  ): Promise<InsuranceOverview | null> {
    return this.service.getInsuranceOverview(user)
  }
}
