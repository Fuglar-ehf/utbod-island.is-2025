import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { TransportAuthorityApi } from '../transportAuthority.service'
import { OwnerChangeAnswers } from './dto'
import { OwnerChangeValidation } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly transportAuthorityApi: TransportAuthorityApi) {}

  @Query(() => OwnerChangeValidation, { nullable: true })
  vehicleOwnerChangeValidation(
    @CurrentUser() user: User,
    @Args('answers') answers: OwnerChangeAnswers,
  ) {
    return this.transportAuthorityApi.validateApplicationForOwnerChange(
      user,
      answers,
    )
  }
}
