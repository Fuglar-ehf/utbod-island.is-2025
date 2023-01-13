import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { CustomDelegation, Domain } from '../models'
import { ISLAND_DOMAIN } from '../services/constants'
import { DomainLoader } from '../loaders/domain.loader'
import type { DomainDataLoader } from '../loaders/domain.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => CustomDelegation)
export class CustomDelegationResolver {
  @ResolveField('domain', () => Domain)
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() delegation: CustomDelegation,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<Domain> {
    return domainLoader.load({
      lang,
      domain: delegation.domainName ?? ISLAND_DOMAIN,
    })
  }
}
