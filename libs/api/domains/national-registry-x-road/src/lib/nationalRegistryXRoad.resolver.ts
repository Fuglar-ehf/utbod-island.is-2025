import { Resolver, Query, ResolveField, Parent, Context } from '@nestjs/graphql'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver(() => NationalRegistryPerson)
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => NationalRegistryPerson)
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryPerson | undefined> {
    return await this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user.nationalId,
    )
  }

  @ResolveField('children', () => [NationalRegistryPerson])
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryPerson[] | undefined> {
    return await this.nationalRegistryXRoadService.getChildrenCustodyInformation(
      person.nationalId,
      user.authorization,
    )
  }
}
