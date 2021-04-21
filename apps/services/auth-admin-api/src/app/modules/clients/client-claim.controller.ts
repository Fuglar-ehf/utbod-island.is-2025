import {
  ClientsService,
  ClientClaimDTO,
  ClientClaim,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('client-claim')
@Controller('backend/client-claim')
export class ClientClaimController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new claim to client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientClaim })
  async create(@Body() claim: ClientClaimDTO): Promise<ClientClaim> {
    return await this.clientsService.addClaim(claim)
  }

  /** Removes a claim from client */
  @Scopes(Scope.root, Scope.full)
  @Delete(':clientId/:claimType/:claimValue')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('claimType') claimType: string,
    @Param('claimValue') claimValue: string,
  ): Promise<number> {
    if (!clientId || !claimType || !claimValue) {
      throw new BadRequestException(
        'clientId, claimType and claimValue must be provided',
      )
    }

    return await this.clientsService.removeClaim(
      clientId,
      claimType,
      claimValue,
    )
  }
}
