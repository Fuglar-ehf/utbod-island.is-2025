import { Module } from '@nestjs/common'

import { ApiConfigWithIdsAuth, exportedApis } from './apiConfig'
import { SkatturinnClientService } from './skatturinn.service'

@Module({
  providers: [SkatturinnClientService, ApiConfigWithIdsAuth, ...exportedApis],
  exports: [SkatturinnClientService],
})
export class SkatturinnClientModule {}
