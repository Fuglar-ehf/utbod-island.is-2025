import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CaseResultService } from './cases.service'
import { CaseResult } from '../models/caseResult.model'
import { AdviceResult } from '../models/adviceResult.model'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { GetCaseInput } from '../dto/case.input'
import { GetCasesInput } from '../dto/cases.input'
import { CasesAggregateResult } from '../models/casesAggregateResult.model'
import { PostAdviceInput } from '../dto/postAdvice.input'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

@UseGuards(FeatureFlagGuard)
@Resolver()
export class CaseResultResolver {
  constructor(private caseResultService: CaseResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => CasesAggregateResult, { name: 'consultationPortalGetCases' })
  async getCases(
    @Args('input', { type: () => GetCasesInput }) input: GetCasesInput,
  ): Promise<CasesAggregateResult> {
    return await this.caseResultService.getCases(input)
  }

  @Query(() => CaseResult, { name: 'consultationPortalCaseById' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getCase(
    @Args('input', { type: () => GetCaseInput }) input: GetCaseInput,
  ): Promise<CaseResult> {
    return await this.caseResultService.getCase(input)
  }

  @Query(() => [AdviceResult], { name: 'consultationPortalAdviceByCaseId' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getAdvices(
    @Args('input', { type: () => GetCaseInput }) input: GetCaseInput,
  ): Promise<AdviceResult[]> {
    const advices = await this.caseResultService.getAdvices(input)
    return advices
  }

  @Mutation(() => Boolean!, {
    nullable: true,
    name: 'consultationPortalPostAdvice',
  })
  @FeatureFlag(Features.consultationPortalApplication)
  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(ApiScope.samradsgatt)
  async postAdvice(
    @Args('input', { type: () => PostAdviceInput }) input: PostAdviceInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    const response = await this.caseResultService.postAdvice(user, input)
    return response
  }
}
