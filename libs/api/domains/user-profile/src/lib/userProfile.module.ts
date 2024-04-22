import { DynamicModule } from '@nestjs/common'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { UserProfileResolver } from './userProfile.resolver'
import { UserProfileService } from './userProfile.service'
import { IslykillService } from './islykill.service'
import {
  IslykillApiModule,
  IslykillApiModuleConfig,
} from '@island.is/clients/islykill'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { UserProfileServiceV2 } from './V2/userProfile.service'
import { UserProfileServiceV1 } from './V1/userProfile.service'

export interface Config {
  islykill: IslykillApiModuleConfig
}

export class UserProfileModule {
  static register(config: Config): DynamicModule {
    return {
      module: UserProfileModule,
      providers: [
        UserProfileService,
        UserProfileServiceV2,
        UserProfileServiceV1,
        UserProfileResolver,
        IslykillService,
      ],
      imports: [
        FeatureFlagModule,
        IslykillApiModule.register({
          cert: config.islykill.cert,
          passphrase: config.islykill.passphrase,
          basePath: config.islykill.basePath,
        }),
        UserProfileClientModule,
      ],
      exports: [],
    }
  }
}
