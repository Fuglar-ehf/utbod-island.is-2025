import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService, PdfService } from '../../case'
import { Defendant } from '../../defendant'
import { PoliceService } from '../../police'
import { UserService } from '../../user'
import { InternalSubpoenaController } from '../internalSubpoena.controller'
import { LimitedAccessSubpoenaController } from '../limitedAccessSubpoena.controller'
import { Subpoena } from '../models/subpoena.model'
import { SubpoenaController } from '../subpoena.controller'
import { SubpoenaService } from '../subpoena.service'

jest.mock('../../user/user.service')
jest.mock('../../case/case.service')
jest.mock('../../case/pdf.service')
jest.mock('../../police/police.service')

export const createTestingSubpoenaModule = async () => {
  const subpoenaModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [sharedAuthModuleConfig] })],
    controllers: [
      SubpoenaController,
      InternalSubpoenaController,
      LimitedAccessSubpoenaController,
    ],
    providers: [
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      SharedAuthModule,
      UserService,
      CaseService,
      PdfService,
      PoliceService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(Subpoena),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      {
        provide: getModelToken(Defendant),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      SubpoenaService,
    ],
  }).compile()

  const userService = subpoenaModule.get<UserService>(UserService)

  const pdfService = subpoenaModule.get<PdfService>(PdfService)

  const subpoenaModel = await subpoenaModule.resolve<typeof Subpoena>(
    getModelToken(Subpoena),
  )

  const subpoenaService = subpoenaModule.get<SubpoenaService>(SubpoenaService)

  const subpoenaController =
    subpoenaModule.get<SubpoenaController>(SubpoenaController)

  const internalSubpoenaController =
    subpoenaModule.get<InternalSubpoenaController>(InternalSubpoenaController)

  const limitedAccessSubpoenaController =
    subpoenaModule.get<LimitedAccessSubpoenaController>(
      LimitedAccessSubpoenaController,
    )

  subpoenaModule.close()

  return {
    userService,
    pdfService,
    subpoenaModel,
    subpoenaService,
    subpoenaController,
    internalSubpoenaController,
    limitedAccessSubpoenaController,
  }
}
