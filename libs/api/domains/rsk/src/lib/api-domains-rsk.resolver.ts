import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { RSKService } from '@island.is/clients/rsk'
import { CurrentUserCompanies } from './models/currentUserCompanies.model'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class RSKResolver {
  constructor(private RSKService: RSKService) {}

  @Query(() => [CurrentUserCompanies])
  async rskCurrentUserCompanies(@CurrentUser() user: User) {
    return this.RSKService.getCompaniesByNationalId(user.nationalId)
  }
}
