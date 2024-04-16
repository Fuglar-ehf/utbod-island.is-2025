import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common'
import * as kennitala from 'kennitala'

import { Documentation } from '@island.is/nest/swagger'
import { Audit } from '@island.is/nest/audit'
import { UserProfileScope } from '@island.is/auth/scopes'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import { UserProfileDto } from './dto/user-profile.dto'
import { UserProfileService } from './user-profile.service'
import { ClientType } from '../types/ClientType'
import { ActorProfileDto } from './dto/actor-profile.dto'

const namespace = '@island.is/user-profile/v2/users'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(UserProfileScope.system, UserProfileScope.admin)
@ApiTags('v2/users')
@ApiSecurity('oauth2', [UserProfileScope.system])
@Controller({
  path: 'users',
  version: ['2'],
})
@Audit({ namespace })
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('/.national-id')
  @Documentation({
    description: 'Get user profile for given nationalId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the user to find',
        },
      },
      query: {
        clientType: {
          required: false,
          description: 'Client type',
          enum: ClientType,
        },
      },
    },
    response: { status: 200, type: UserProfileDto },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  async findUserProfile(
    @Headers('X-Param-National-Id') nationalId: string,
    @Query('clientType') clientType: ClientType = ClientType.THIRD_PARTY,
  ): Promise<UserProfileDto> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('National id is not valid')
    }
    return this.userProfileService.findById(nationalId, false, clientType)
  }

  @Get('/.to-national-id/actor-profiles/.from-national-id')
  @Documentation({
    description: 'Get actor profiles for nationalId.',
    request: {
      header: {
        'X-Param-To-National-Id': {
          required: true,
          description: 'National id of the user the actor profile is for',
        },
        'X-Param-From-National-Id': {
          required: true,
          description: 'National id of the user the delegation is from',
        },
      },
    },
    response: { status: 200, type: ActorProfileDto },
  })
  @Audit<ActorProfileDto>({
    resources: (profile) => profile.fromNationalId,
  })
  async getActorProfile(
    @Headers('X-Param-To-National-Id') toNationalId: string,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
  ): Promise<ActorProfileDto> {
    if (
      !kennitala.isValid(toNationalId) ||
      !kennitala.isValid(fromNationalId)
    ) {
      throw new BadRequestException('National id is not valid')
    }

    return this.userProfileService.getActorProfile({
      toNationalId,
      fromNationalId,
    })
  }
}
