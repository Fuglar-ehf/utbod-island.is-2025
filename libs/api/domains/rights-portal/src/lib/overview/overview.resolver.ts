import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
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
import { InsuranceConfirmationResponse } from './models/insuranceConfirmation.response'
import { InsuranceOverviewResponse } from './models/insuranceOverview.response'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@FeatureFlag(Features.servicePortalHealthOverviewPage)
@Audit({ namespace: '@island.is/api/rights-portal/overview' })
@Scopes(
  ApiScope.healthPayments,
  ApiScope.healthMedicines,
  ApiScope.healthAssistiveAndNutrition,
  ApiScope.healthTherapies,
  ApiScope.healthHealthcare,
  ApiScope.healthDentists,
)
export class OverviewResolver {
  constructor(private readonly service: OverviewService) {}

  @Query(() => InsuranceConfirmationResponse, {
    name: 'rightsPortalInsuranceConfirmation',
  })
  @Audit()
  async getInsuranceConfirmation(
    @CurrentUser() user: User,
  ): Promise<InsuranceConfirmationResponse> {
    return await this.service.getInsuranceConfirmation(user)
  }

  @Query(() => InsuranceOverviewResponse, {
    name: 'rightsPortalInsuranceOverview',
  })
  @Audit()
  async getInsuranceOverview(
    @CurrentUser() user: User,
  ): Promise<InsuranceOverviewResponse> {
    return await this.service.getInsuranceOverview(user)
  }
}
