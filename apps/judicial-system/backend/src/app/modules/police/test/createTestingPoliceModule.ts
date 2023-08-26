import { Test } from '@nestjs/testing'

import { ConfigModule, ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { EventService } from '../../event'
import { AwsS3Service } from '../../aws-s3'
import { CaseService } from '../../case'
import { PoliceService } from '../police.service'
import { PoliceController } from '../police.controller'
import { policeModuleConfig } from '../police.config'

jest.mock('../../event/event.service')
jest.mock('../../aws-s3/awsS3.service.ts')
jest.mock('../../case/case.service.ts')

export const createTestingPoliceModule = async () => {
  const policeModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
      ConfigModule.forRoot({ load: [policeModuleConfig] }),
    ],
    controllers: [PoliceController],
    providers: [
      EventService,
      AwsS3Service,
      CaseService,
      PoliceService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
    ],
  }).compile()

  const config = policeModule.get<ConfigType<typeof policeModuleConfig>>(
    policeModuleConfig.KEY,
  )

  const awsS3Service = policeModule.get<AwsS3Service>(AwsS3Service)

  const policeService = policeModule.get<PoliceService>(PoliceService)

  const policeController = policeModule.get<PoliceController>(PoliceController)

  policeModule.close()

  return { config, awsS3Service, policeService, policeController }
}
