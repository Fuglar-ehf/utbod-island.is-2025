import {
  AccessService,
  AdminAccess,
  AdminAccessDTO,
  AdminAccessUpdateDTO,
} from '@island.is/auth-api-lib'
import {
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
  User,
  CurrentRestUser,
} from '@island.is/auth-nest-tools'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly accessService: AccessService) {}

  /** Gets permitted scopes  */
  @Scopes('@identityserver.api/authentication')
  @Get('scopes')
  @ApiOkResponse({ isArray: true })
  async findAllPermittedScopes(
    @CurrentRestUser() user: User,
    @Query(
      'requestedScopes',
      new ParseArrayPipe({ optional: false, items: String, separator: ',' }),
    )
    requestedScopes: string[],
  ): Promise<string[] | null> {
    const access = await this.accessService.findAll(
      user.nationalId,
      requestedScopes,
    )

    if (access) {
      return access.map((a) => a.scope)
    }

    return []
  }
}
