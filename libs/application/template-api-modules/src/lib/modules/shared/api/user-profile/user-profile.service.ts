import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import {
  BaseTemplateAPIModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationWithAttachments,
  UserProfile,
  UserProfileParameters,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getSlugFromType } from '@island.is/application/core'
import { IdsClientConfig } from '@island.is/nest/config'
import { Inject } from '@nestjs/common'
import { ConfigService, ConfigType } from '@nestjs/config'
import { getConfigValue } from '../../shared.utils'

export const MAX_OUT_OF_DATE_MONTHS = 6

@Injectable()
export class UserProfileService extends BaseTemplateApiService {
  constructor(
    private readonly userProfileApi: UserProfileApi,
    private readonly islyklarApi: IslyklarApi,
    @Inject(IdsClientConfig.KEY)
    private idsClientConfig: ConfigType<typeof IdsClientConfig>,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
  ) {
    super('UserProfile')
  }

  userProfileApiWithAuth(auth: Auth): UserProfileApi {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async userProfile({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<UserProfileParameters>): Promise<UserProfile> {
    // Temporary solution while we still run the old user profile service.
    return this.islyklarApi
      .islyklarGet({ ssn: auth.nationalId })

      .then((results) => {
        if (params?.validateBankInformation && !results?.bankInfo) {
          // If individual does not have a valid bank account, then we fail this check
          throw new TemplateApiError(
            {
              title: coreErrorMessages.noBankAccountError,
              summary: coreErrorMessages.noBankAccountError,
            },
            400,
          )
        }

        if (params?.validateEmail && !results?.email) {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.noEmailFound,
              summary: {
                ...coreErrorMessages.noEmailFoundDescription,
                values: { link: this.getIDSLink(application) },
              },
            },
            500,
          )
        }

        return {
          mobilePhoneNumber: results?.mobile,
          email: results?.email,
          bankInfo: results?.bankInfo,
        }
      })
      .catch((error) => {
        if (isRunningOnEnvironment('local')) {
          return {
            email: 'mockEmail@island.is',
            mobilePhoneNumber: '9999999',
            bankInfo: '0000-11-222222',
          }
        }
        if (params?.catchMock) {
          return {}
        }
        throw error
      })
  }

  private getIDSLink(application: ApplicationWithAttachments) {
    const slug = getSlugFromType(application.typeId)
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    return `${this.idsClientConfig.issuer}/app/user-profile/email?state=update&returnUrl=${clientLocationOrigin}/${slug}/${application.id}`
  }
}
