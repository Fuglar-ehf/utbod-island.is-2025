import { Args, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import type { Locale } from '@island.is/shared/types'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Scopes } from '@island.is/auth-nest-tools'
import { ApplicationApplicationsAdminInput } from './dto/applications-applications-admin-input'
import { ApplicationAdmin } from '../application.model'
import { ApplicationService } from '../application.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationAdmin)
@Scopes(AdminPortalScope.applicationSystem)
export class ApplicationAdminResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => [ApplicationAdmin], { nullable: true })
  async applicationApplicationsAdmin(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input')
    input: ApplicationApplicationsAdminInput,
  ): Promise<ApplicationAdmin[] | null> {
    return this.applicationService.findAllAdmin(user, locale, input)
  }
}
