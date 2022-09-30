import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { IntlService } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { AwsS3Service } from '../../aws-s3'
import { CaseService } from '../../case'
import { CaseFile } from '../models/file.model'
import { FileService } from '../file.service'
import { FileController } from '../file.controller'

jest.mock('../../aws-s3/awsS3.service.ts')
jest.mock('../../court/court.service.ts')
jest.mock('../../case/case.service.ts')

export const createTestingFileModule = async () => {
  const fileModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [FileController],
    providers: [
      CaseService,
      CourtService,
      AwsS3Service,
      {
        provide: IntlService,
        useValue: {
          useIntl: async () => ({
            formatMessage: createTestIntl({
              onError: jest.fn(),
              locale: 'is-IS',
            }).formatMessage,
          }),
        },
      },
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(CaseFile),
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        },
      },
      FileService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const awsS3Service = fileModule.get<AwsS3Service>(AwsS3Service)

  const courtService = fileModule.get<CourtService>(CourtService)

  const fileModel = await fileModule.resolve<typeof CaseFile>(
    getModelToken(CaseFile),
  )

  const fileService = fileModule.get<FileService>(FileService)

  const fileController = fileModule.get<FileController>(FileController)

  return {
    awsS3Service,
    courtService,
    fileModel,
    fileService,
    fileController,
  }
}
