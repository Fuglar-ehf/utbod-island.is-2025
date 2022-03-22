import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import differenceInMonths from 'date-fns/differenceInMonths'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { ApolloError, ForbiddenError } from 'apollo-server-express'
import {
  ConfirmationDtoResponse,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserProfileApi,
  UserProfileControllerCreateRequest,
  UserProfileControllerUpdateRequest,
} from '@island.is/clients/user-profile'
import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { UserProfile } from './userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from './islykill.service'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DataStatus } from './types/dataStatus.enum'
import { FetchError } from '@island.is/clients/middlewares'

export const MAX_OUT_OF_DATE_MONTHS = 6

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileApi: UserProfileApi,
    private readonly islyklarService: IslykillService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getIslykillProfile(user: User) {
    try {
      const feature = await this.featureFlagService.getValue(
        Features.personalInformation,
        false,
        user,
      )
      if (!feature) {
        return null
      }

      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      return {
        nationalId: user.nationalId,
        emailVerified: false,
        mobilePhoneNumberVerified: false,
        documentNotifications: false,
        emailStatus: DataStatus.NOT_VERIFIED,
        mobileStatus: DataStatus.NOT_VERIFIED,

        // Islyklar data:
        mobilePhoneNumber: islyklarData?.mobile,
        email: islyklarData?.email,
        canNudge: islyklarData?.canNudge,
        bankInfo: islyklarData?.bankInfo,
      }
    } catch (error) {
      logger.error(JSON.stringify(error))
      return null
    }
  }

  async getUserProfileStatus(user: User) {
    /**
     * this.getUserProfile can be a bit slower with the addition of islyklar data call.
     * getUserProfileStatus can be used for a check if the userprofile exists, or if the userdata is old
     * Old userdata can mean a user will be prompted to verify their info in the UI.
     */
    try {
      const profile = await this.userProfileApiWithAuth(
        user,
      ).userProfileControllerFindOneByNationalId({
        nationalId: user.nationalId,
      })

      /**
       * If user has empty email or tel data
       * Then the user will be prompted every 6 months (MAX_OUT_OF_DATE_MONTHS)
       * to verify if they want to keep their info empty
       */
      const emptyMail = profile?.emailStatus === 'EMPTY'
      const emptyMobile = profile?.mobileStatus === 'EMPTY'
      const modifiedProfileDate = profile?.modified
      const dateNow = new Date()
      const dateModified = new Date(modifiedProfileDate)
      const diffInMonths = differenceInMonths(dateNow, dateModified)
      const diffOutOfDate = diffInMonths >= MAX_OUT_OF_DATE_MONTHS
      const outOfDateEmailMobile = (emptyMail || emptyMobile) && diffOutOfDate

      return {
        hasData: !!modifiedProfileDate,
        hasModifiedDateLate: outOfDateEmailMobile,
      }
    } catch (error) {
      if (error.status === 404) {
        return {
          hasData: false,
          hasModifiedDateLate: true,
        }
      }
      handleError(error)
    }
  }

  async getUserProfile(user: User) {
    try {
      const profile = await this.userProfileApiWithAuth(
        user,
      ).userProfileControllerFindOneByNationalId({
        nationalId: user.nationalId,
      })

      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      const feature = await this.featureFlagService.getValue(
        Features.personalInformation,
        false,
        user,
      )

      return {
        ...profile,

        // Temporary solution while we still run the old user profile service.
        ...(feature && {
          mobilePhoneNumber: islyklarData?.mobile,
          email: islyklarData?.email,
          canNudge: islyklarData?.canNudge,
          bankInfo: islyklarData?.bankInfo,
        }),
      }
    } catch (error) {
      if (error.status === 404) {
        /**
         * Even if userProfileApiWithAuth does not exist.
         * Islykill data might exist for the user, so we need to get that, with default values in the userprofile data.
         */
        return await this.getIslykillProfile(user)
      }
      handleError(error)
    }
  }

  async createUserProfile(
    input: CreateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const createUserDto: CreateUserProfileDto = {
      nationalId: user.nationalId,
      //temporary as schemas where not working properly
      locale: input.locale as string,
      smsCode: input.smsCode,
      emailCode: input.emailCode,
      emailStatus: input.emailStatus,
      mobileStatus: input.mobileStatus,

      /**
       *  Mobile and email will be within islykill service
       *  Only here for verification purposes in userProfile.controller.
       *  Will be removed in controller before saving to db
       */
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email,
    }
    const request: UserProfileControllerCreateRequest = {
      createUserProfileDto: createUserDto,
    }

    const feature = await this.featureFlagService.getValue(
      Features.personalInformation,
      false,
      user,
    )

    const userProfileResponse = await this.userProfileApiWithAuth(user)
      .userProfileControllerCreate(request)
      .catch(handleError)

    if (feature && (input.email || input.mobilePhoneNumber)) {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      const emailVerified =
        userProfileResponse.emailStatus === DataStatus.VERIFIED
      const mobileVerified =
        userProfileResponse.mobileStatus === DataStatus.VERIFIED
      if (
        (input.email && !emailVerified) ||
        (input.mobilePhoneNumber && !mobileVerified)
      ) {
        throw new ForbiddenError('Updating value verification invalid')
      }

      if (islyklarData.noUserFound) {
        await this.islyklarService
          .createIslykillSettings(user.nationalId, {
            email: emailVerified ? input.email : undefined,
            mobile: mobileVerified ? input.mobilePhoneNumber : undefined,
          })
          .catch(handleError)
      } else {
        await this.islyklarService
          .updateIslykillSettings(user.nationalId, {
            email: emailVerified ? input.email : islyklarData.email,
            mobile: mobileVerified
              ? input.mobilePhoneNumber
              : islyklarData.mobile,
            bankInfo: islyklarData.bankInfo,
            canNudge: islyklarData.canNudge,
          }) // Current version does not return the updated user in the response.
          .catch(handleError)
      }
    } else {
      logger.info('User profile create is feature flagged for user')
    }

    return userProfileResponse
  }

  async updateUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const updateUserDto: UpdateUserProfileDto = {
      //temporary as schemas where not working properly
      locale: input.locale as string,
      documentNotifications: input.documentNotifications,
      smsCode: input.smsCode,
      emailCode: input.emailCode,

      /**
       *  Mobile and email will be within islykill service
       *  Only here for verification purposes in userProfile.controller.
       *  Will be removed in controller before saving to db
       */
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email,
    }
    const request: UserProfileControllerUpdateRequest = {
      nationalId: user.nationalId,
      updateUserProfileDto: updateUserDto,
    }

    const feature = await this.featureFlagService.getValue(
      Features.personalInformation,
      false,
      user,
    )

    let updatedUserProfile: UserProfile
    try {
      updatedUserProfile = await this.userProfileApiWithAuth(
        user,
      ).userProfileControllerUpdate(request)
    } catch (error) {
      // Poor man's fix to allow update to be createOrUpdate.
      // TODO: update the user profile API to support createOrUpdate
      if (error instanceof FetchError && error.status === 404) {
        updatedUserProfile = await this.userProfileApiWithAuth(
          user,
        ).userProfileControllerCreate({
          createUserProfileDto: {
            nationalId: user.nationalId,
            ...updateUserDto,
          },
        })
      } else {
        return handleError(error)
      }
    }

    if (feature) {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      const emailVerified =
        updatedUserProfile.emailStatus === DataStatus.VERIFIED
      const mobileVerified =
        updatedUserProfile.mobileStatus === DataStatus.VERIFIED
      if (
        (input.email && !emailVerified) ||
        (input.mobilePhoneNumber && !mobileVerified)
      ) {
        throw new ForbiddenError('Updating value verification invalid')
      }

      if (islyklarData.noUserFound) {
        await this.islyklarService
          .createIslykillSettings(user.nationalId, {
            email:
              input.email && emailVerified ? input.email : islyklarData.email,
            mobile:
              input.mobilePhoneNumber && mobileVerified
                ? input.mobilePhoneNumber
                : islyklarData.mobile,
          })
          .catch(handleError)
      } else {
        await this.islyklarService
          .updateIslykillSettings(user.nationalId, {
            email:
              input.email && emailVerified ? input.email : islyklarData.email,
            mobile:
              input.mobilePhoneNumber && mobileVerified
                ? input.mobilePhoneNumber
                : islyklarData.mobile,
            canNudge: input.canNudge ?? islyklarData.canNudge,
            bankInfo: input.bankInfo ?? islyklarData.bankInfo,
          })
          .catch(handleError)
      }
    } else {
      logger.info('User profile update is feature flagged for user')
    }

    return updatedUserProfile
  }

  async deleteIslykillValue(
    input: DeleteIslykillValueInput,
    user: User,
  ): Promise<DeleteIslykillSettings> {
    const feature = await this.featureFlagService.getValue(
      Features.personalInformation,
      false,
      user,
    )
    if (!feature) {
      handleError('User profile update is feature flagged for user')
    }
    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )
    if (islyklarData.noUserFound) {
      await this.islyklarService
        .createIslykillSettings(user.nationalId, {
          email: undefined,
          mobile: undefined,
        })
        .catch(handleError)
    } else {
      await this.islyklarService
        .updateIslykillSettings(user.nationalId, {
          email: input.email ? undefined : islyklarData.email,
          mobile: input.mobilePhoneNumber ? undefined : islyklarData.mobile,
          canNudge: islyklarData.canNudge,
          bankInfo: islyklarData.bankInfo,
        })
        .catch(handleError)
    }

    const profile = await this.userProfileApiWithAuth(user)
      .userProfileControllerFindOneByNationalId({
        nationalId: user.nationalId,
      })
      .catch((e) => {
        if (e.status === 404) {
          return null
        }
        handleError(e)
      })

    const profileUpdate = {
      emailStatus: input.email ? DataStatus.EMPTY : DataStatus.NOT_VERIFIED,
      mobileStatus: input.mobilePhoneNumber
        ? DataStatus.EMPTY
        : DataStatus.NOT_VERIFIED,
    }

    if (profile) {
      await this.userProfileApiWithAuth(user)
        .userProfileControllerUpdate({
          nationalId: user.nationalId,
          updateUserProfileDto: profileUpdate,
        })
        .catch(handleError)
    } else {
      await this.userProfileApiWithAuth(user)
        .userProfileControllerCreate({
          createUserProfileDto: {
            ...profileUpdate,
            nationalId: user.nationalId,
          },
        })
        .catch(handleError)
    }

    return {
      nationalId: user.nationalId,
      valid: true,
    }
  }

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    const createSmsVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(user)
      .userProfileControllerCreateSmsVerification({ createSmsVerificationDto })
      .catch(handleError)
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    const createEmailVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(user)
      .userProfileControllerCreateEmailVerification({
        createEmailVerificationDto,
      })
      .catch(handleError)
  }

  async resendEmailVerification(user: User): Promise<void> {
    await this.userProfileApiWithAuth(user)
      .userProfileControllerRecreateVerification({
        nationalId: user.nationalId,
      })
      .catch(handleError)
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmSmsDto } = input
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerConfirmSms({
        nationalId: user.nationalId,
        confirmSmsDto,
      })
      .catch(handleError)
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmEmailDto } = input
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerConfirmEmail({
        nationalId: user.nationalId,
        confirmEmailDto,
      })
      .catch(handleError)
  }

  async addDeviceToken(input: UserDeviceTokenInput, user: User) {
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerAddDeviceToken({
        nationalId: user.nationalId,
        deviceTokenDto: input,
      })
      .catch(handleError)
  }

  async deleteDeviceToken(input: UserDeviceTokenInput, user: User) {
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerDeleteDeviceToken({
        nationalId: user.nationalId,
        deviceTokenDto: input,
      })
      .catch(handleError)
  }
}
