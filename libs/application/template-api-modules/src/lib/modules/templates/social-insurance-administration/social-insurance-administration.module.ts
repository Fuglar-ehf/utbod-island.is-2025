import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import {
  APPLICATION_ATTACHMENT_BUCKET,
  OldAgePensionService,
} from './social-insurance-administration.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'

//TODO: Use process.env
const XROAD_SIA_MEMBER_CODE = process.env.XROAD_TR_MEMBER_CODE ?? ''
const XROAD_SIA_API_PATH = process.env.XROAD_TR_API_PATH ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''
const XROAD_SIA_API_KEY = process.env.XROAD_TR_API_KEY ?? ''

export class OldAgePensionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OldAgePensionModule,
      imports: [
        SocialInsuranceAdministrationClientModule.register({
          xRoadPath: createXRoadAPIPath(
            config.xRoadBasePathWithEnv,
            XRoadMemberClass.GovernmentInstitution,
            XROAD_SIA_MEMBER_CODE,
            XROAD_SIA_API_PATH,
          ),
          xRoadClient: XROAD_CLIENT_ID,
          apiKey: XROAD_SIA_API_KEY,
        }),
        SharedTemplateAPIModule.register(config),
        ApplicationApiCoreModule,
        NationalRegistryClientModule,
      ],
      providers: [
        OldAgePensionService,
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useFactory: () => config.attachmentBucket,
        },
      ],
      exports: [OldAgePensionService],
    }
  }
}
