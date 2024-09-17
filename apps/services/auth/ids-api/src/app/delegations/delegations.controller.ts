import {
  Controller,
  Get,
  Headers,
  Inject,
  ParseArrayPipe,
  Query,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DelegationDTO,
  DelegationScopeService,
  DelegationsIncomingService,
  DelegationsIndexService,
  DelegationsService,
  MergedDelegationDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationVerificationResult } from './delegation-verification-result.dto'

import type { Logger } from '@island.is/logging'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller({
  path: 'delegations',
  version: ['1', VERSION_NEUTRAL],
})
export class DelegationsController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    protected readonly logger: Logger,
    private readonly delegationsService: DelegationsService,
    private readonly delegationScopeService: DelegationScopeService,
    private readonly delegationsIncomingService: DelegationsIncomingService,
    private readonly delegationIndexService: DelegationsIndexService,
  ) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllToV1(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    const delegations = await this.delegationsService.findAllIncoming(user)

    // don't fail the request if indexing fails
    try {
      void this.delegationIndexService.indexDelegations(user)
    } catch {
      this.logger.error('Failed to index delegations')
    }

    return delegations
  }

  @Scopes('@identityserver.api/authentication')
  @Version('2')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllToV2(@CurrentUser() user: User): Promise<MergedDelegationDTO[]> {
    const delegations = await this.delegationsIncomingService.findAllAvailable({
      user,
    })

    // don't fail the request if indexing fails
    try {
      void this.delegationIndexService.indexDelegations(user)
    } catch {
      this.logger.error('Failed to index delegations')
    }

    return delegations
  }

  @Scopes('@identityserver.api/authentication')
  @Get('scopes')
  @ApiOkResponse({ isArray: true })
  findAllScopesTo(
    @CurrentUser() user: User,
    @Query('fromNationalId') fromNationalId: string,
    @Query(
      'delegationType',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    delegationType: Array<string>,
  ): Promise<string[]> {
    if (
      delegationType?.some(
        (dt) => dt === AuthDelegationType.PersonalRepresentative,
      )
    ) {
      // TODO: For backwards compatibility with IDS, add PersonalRepresentative:postholf type. Then remove this.
      delegationType.push(
        AuthDelegationType.PersonalRepresentative + ':postholf',
      )
    }

    return this.delegationScopeService.findAllScopesTo(
      user,
      fromNationalId,
      delegationType,
    )
  }

  @Scopes('@identityserver.api/authentication')
  @Get('verify')
  @ApiOkResponse({ type: DelegationVerificationResult })
  async verify(
    @CurrentUser() user: User,
    @Headers('X-Query-From-National-Id')
    fromNationalId: string,
    @Query('delegationType')
    delegationType: AuthDelegationType[],
  ): Promise<DelegationVerificationResult> {
    if (!Array.isArray(delegationType)) delegationType = [delegationType]

    const verified =
      await this.delegationsIncomingService.verifyDelegationAtProvider(
        user,
        fromNationalId,
        delegationType,
      )

    return { verified }
  }
}
