import {
  ClientsService,
  ClientPostLogoutRedirectUriDTO,
  ClientPostLogoutRedirectUri,
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
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('client-post-logout-redirect-uri')
@Controller('client-post-logout-redirect-uri')
export class ClientPostLogoutRedirectUriController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new Grant type to client */
  @Post()
  @ApiCreatedResponse({ type: ClientPostLogoutRedirectUri })
  async create(
    @Body() postLogoutUri: ClientPostLogoutRedirectUriDTO,
  ): Promise<ClientPostLogoutRedirectUri> {
    return await this.clientsService.addPostLogoutRedirectUri(postLogoutUri)
  }

  /** Removes a grant type from client */
  @Delete(':clientId/:redirectUri')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('redirectUri') redirectUri: string,
  ): Promise<number> {
    if (!clientId || !redirectUri) {
      throw new BadRequestException('clientId and redirectUri must be provided')
    }

    return await this.clientsService.removePostLogoutRedirectUri(
      clientId,
      redirectUri,
    )
  }
}
