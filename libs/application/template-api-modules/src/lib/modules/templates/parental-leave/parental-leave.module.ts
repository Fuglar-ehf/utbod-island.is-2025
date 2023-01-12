import { DynamicModule } from '@nestjs/common'

import { VMSTModule } from '@island.is/clients/vmst'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import {
  ParentalLeaveService,
  APPLICATION_ATTACHMENT_BUCKET,
} from './parental-leave.service'
import { SmsModule } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  NationalRegistryClientModule,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'

const XROAD_VMST_MEMBER_CODE = process.env.XROAD_VMST_MEMBER_CODE ?? ''
const XROAD_VMST_API_PATH = process.env.XROAD_VMST_API_PATH ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''
const XROAD_VMST_API_KEY = process.env.XROAD_VMST_API_KEY ?? ''

export class ParentalLeaveModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ParentalLeaveModule,
      imports: [
        VMSTModule.register({
          xRoadPath: createXRoadAPIPath(
            config.xRoadBasePathWithEnv,
            XRoadMemberClass.GovernmentInstitution,
            XROAD_VMST_MEMBER_CODE,
            XROAD_VMST_API_PATH,
          ),
          xRoadClient: XROAD_CLIENT_ID,
          apiKey: XROAD_VMST_API_KEY,
        }),
        SharedTemplateAPIModule.register(config),
        SmsModule.register(config.smsOptions),
        ApplicationApiCoreModule,
        NationalRegistryClientModule,
      ],
      providers: [
        ChildrenService,
        ParentalLeaveService,
        NationalRegistryClientService,
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useFactory: () => config.attachmentBucket,
        },
      ],
      exports: [ParentalLeaveService],
    }
  }
}
