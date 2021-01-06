import {
  Body,
  Controller,
  Get,
  Put,
  NotFoundException,
  Param,
  Post,
  ConflictException,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ConfirmationDtoResponse } from './dto/confirmationResponseDto'
import { ConfirmEmailDto } from './dto/confirmEmailDto'
import { ConfirmSmsDto } from './dto/confirmSmsDto'
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { EmailVerification } from './emailVerification.model'
import { UserProfileByNationalIdPipe } from './pipes/userProfileByNationalId.pipe'
import { SmsVerification } from './smsVerification.model'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { VerificationService } from './verification.service'

@ApiTags('User Profile')
@Controller()
export class UserProfileController {
  constructor(
    private userProfileService: UserProfileService,
    private verificationService: VerificationService,
  ) {}

  @Get('userProfile/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The nationalId of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UserProfile })
  async findOneByNationalId(
    @Param('nationalId', UserProfileByNationalIdPipe) profile: UserProfile,
  ): Promise<UserProfile> {
    return profile
  }

  @Post('userProfile/')
  @ApiCreatedResponse({ type: UserProfile })
  async create(
    @Body()
    userProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    if (
      await this.userProfileService.findByNationalId(userProfileDto.nationalId)
    ) {
      throw new ConflictException(
        `A profile with nationalId - "${userProfileDto.nationalId}" already exists`,
      )
    }

    if (userProfileDto.email) {
      await this.verificationService.createEmailVerification(
        userProfileDto.nationalId,
        userProfileDto.email,
      )
    }

    if (userProfileDto.mobilePhoneNumber) {
      const phoneVerified = await this.verificationService.isPhoneNumberVerified(
        userProfileDto,
      )
      userProfileDto = {
        ...userProfileDto,
        mobilePhoneNumberVerified: phoneVerified,
      }
      if (phoneVerified) {
        await this.verificationService.removeSmsVerification(
          userProfileDto.nationalId,
        )
      }
    }

    return await this.userProfileService.create(userProfileDto)
  }

  @Put('userProfile/:nationalId')
  @ApiOkResponse({ type: UserProfile })
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user profile to be updated.',
    allowEmptyValue: false,
  })
  async update(
    @Param('nationalId', UserProfileByNationalIdPipe) profile: UserProfile,
    @Body() userProfileToUpdate: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const { nationalId } = profile
    userProfileToUpdate = {
      ...userProfileToUpdate,
      emailVerified: profile.emailVerified,
      mobilePhoneNumberVerified: profile.mobilePhoneNumberVerified,
    }

    if (userProfileToUpdate.mobilePhoneNumber) {
      const { mobilePhoneNumber } = userProfileToUpdate
      const phoneVerified = await this.verificationService.isPhoneNumberVerified(
        { nationalId, mobilePhoneNumber },
      )

      userProfileToUpdate = {
        ...userProfileToUpdate,
        mobilePhoneNumberVerified: phoneVerified,
      }
    }

    if (
      userProfileToUpdate.email &&
      userProfileToUpdate.email !== profile.email
    ) {
      await this.verificationService.createEmailVerification(
        nationalId,
        userProfileToUpdate.email,
      )
      userProfileToUpdate = { ...userProfileToUpdate, emailVerified: false }
    }

    const {
      numberOfAffectedRows,
      updatedUserProfile,
    } = await this.userProfileService.update(nationalId, userProfileToUpdate)
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    return updatedUserProfile
  }

  @Post('emailVerification/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @ApiCreatedResponse({ type: EmailVerification })
  async recreateVerification(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
  ): Promise<EmailVerification | null> {
    if (!profile.email) {
      return null
    }

    return await this.verificationService.createEmailVerification(
      profile.nationalId,
      profile.email,
    )
  }

  @Post('confirmEmail/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @ApiCreatedResponse({ type: ConfirmationDtoResponse })
  async confirmEmail(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @Body() confirmEmailDto: ConfirmEmailDto,
  ): Promise<ConfirmationDtoResponse> {
    return await this.verificationService.confirmEmail(confirmEmailDto, profile)
  }

  @Post('confirmSms/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @ApiCreatedResponse({ type: ConfirmationDtoResponse })
  async confirmSms(
    @Param('nationalId')
    nationalId: string,
    @Body() confirmSmsDto: ConfirmSmsDto,
  ): Promise<ConfirmationDtoResponse> {
    return await this.verificationService.confirmSms(confirmSmsDto, nationalId)
  }

  @Post('smsVerification/')
  async createSmsVerification(
    @Body() createSmsVerification: CreateSmsVerificationDto,
  ): Promise<SmsVerification | null> {
    return await this.verificationService.createSmsVerification(
      createSmsVerification,
    )
  }
}
