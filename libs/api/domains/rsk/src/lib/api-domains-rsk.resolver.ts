import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RSKService } from '@island.is/clients/rsk/v1'
import { Audit } from '@island.is/nest/audit'

import { CurrentUserCompanies } from './models/currentUserCompanies.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/rsk' })
export class RSKResolver {
  constructor(private RSKService: RSKService) {}

  @Query(() => [CurrentUserCompanies])
  @Audit()
  async rskCurrentUserCompanies(@CurrentUser() user: User) {
    return this.RSKService.getCompaniesByNationalId(user.nationalId)
  }
}
