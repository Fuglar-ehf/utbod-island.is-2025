import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'
import { ClientType, RefreshTokenExpiration } from '../../../types'
import { ClientAllowedScopeDTO } from '../../dto/client-allowed-scope.dto'
import { ClientAllowedScope } from '../../models/client-allowed-scope.model'
import { AdminClientClaimDto } from './admin-client-claim.dto'

export class AdminClientDto {
  @ApiProperty()
  clientId!: string

  @ApiProperty({
    example: 'web',
    enum: ClientType,
    enumName: 'ClientType',
  })
  clientType!: string

  @ApiProperty({
    type: [TranslatedValueDto],
    example: [
      {
        locale: 'is',
        value: 'Mínar síður ísland.is',
      },
      {
        locale: 'en',
        value: 'My pages on island.is',
      },
    ],
  })
  displayName!: TranslatedValueDto[]

  @ApiProperty({
    description: 'The id of the tenant that the client belongs to',
    example: '@island.is',
  })
  tenantId!: string

  @ApiProperty()
  redirectUris!: string[]

  @ApiProperty()
  postLogoutRedirectUris!: string[]

  @ApiProperty({
    description: 'Absolute lifetime of refresh token in seconds',
  })
  absoluteRefreshTokenLifetime!: number

  @ApiProperty({
    description: 'Sliding lifetime of refresh token in seconds',
  })
  slidingRefreshTokenLifetime!: number

  @ApiProperty({
    description:
      'Indicates if refresh token should expire after inactivity (Sliding) described in `slidingRefreshTokenLifetime` or fixed point in time (Absolute) described in `absoluteRefreshTokenLifetime`',
    enum: RefreshTokenExpiration,
    enumName: 'RefreshTokenExpiration',
  })
  refreshTokenExpiration!: RefreshTokenExpiration

  @ApiProperty()
  supportsCustomDelegation!: boolean

  @ApiProperty()
  supportsLegalGuardians!: boolean

  @ApiProperty()
  supportsProcuringHolders!: boolean

  @ApiProperty()
  supportsPersonalRepresentatives!: boolean

  @ApiProperty()
  promptDelegations!: boolean

  @ApiProperty()
  requireApiScopes!: boolean

  @ApiProperty()
  requireConsent!: boolean

  @ApiProperty()
  allowOfflineAccess!: boolean

  @ApiProperty()
  requirePkce!: boolean

  @ApiProperty({
    description:
      'Indicates if the client supports token exchange grant. Only available for machine clients.',
  })
  supportTokenExchange!: boolean

  @ApiProperty()
  accessTokenLifetime!: number

  @ApiPropertyOptional({
    description: 'Dictionary of custom claims added to access tokens.',
    type: [AdminClientClaimDto],
  })
  customClaims?: AdminClientClaimDto[]

  @ApiProperty({
    description: 'Allowed scopes for the client',
    type: [ClientAllowedScopeDTO],
  })
  allowedScopes?: ClientAllowedScopeDTO[]
}
