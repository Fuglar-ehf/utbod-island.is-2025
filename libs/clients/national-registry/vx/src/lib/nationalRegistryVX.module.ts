import { Module } from '@nestjs/common'

import { ApiConfigWithIdsAuth, exportedApis } from './apiConfig'
import { NationalRegistryVXClientService } from './nationalRegistryVX.service'

@Module({
  providers: [
    NationalRegistryVXClientService,
    ApiConfigWithIdsAuth,
    ...exportedApis,
  ],
  exports: [NationalRegistryVXClientService],
})
export class NationalRegistryVXClientModule {}
