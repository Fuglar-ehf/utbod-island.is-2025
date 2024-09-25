import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import { MessageService } from '@island.is/judicial-system/message'

import { CaseService, PdfService } from '../../case'
import { CourtService } from '../../court'
import { UserService } from '../../user'
import { DefendantController } from '../defendant.controller'
import { DefendantService } from '../defendant.service'
import { InternalDefendantController } from '../internalDefendant.controller'
import { LimitedAccessDefendantController } from '../limitedAccessDefendant.controller'
import { Defendant } from '../models/defendant.model'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../user/user.service')
jest.mock('../../court/court.service')
jest.mock('../../case/case.service')
jest.mock('../../case/pdf.service')

export const createTestingDefendantModule = async () => {
  const defendantModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [sharedAuthModuleConfig] })],
    controllers: [
      DefendantController,
      InternalDefendantController,
      LimitedAccessDefendantController,
    ],
    providers: [
      SharedAuthModule,
      MessageService,
      UserService,
      CourtService,
      CaseService,
      PdfService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
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
      DefendantService,
    ],
  }).compile()

  const messageService = defendantModule.get<MessageService>(MessageService)

  const userService = defendantModule.get<UserService>(UserService)

  const courtService = defendantModule.get<CourtService>(CourtService)

  const pdfService = defendantModule.get<PdfService>(PdfService)

  const defendantModel = await defendantModule.resolve<typeof Defendant>(
    getModelToken(Defendant),
  )

  const defendantService =
    defendantModule.get<DefendantService>(DefendantService)

  const defendantController =
    defendantModule.get<DefendantController>(DefendantController)

  const internalDefendantController =
    defendantModule.get<InternalDefendantController>(
      InternalDefendantController,
    )

  const limitedAccessDefendantController =
    defendantModule.get<LimitedAccessDefendantController>(
      LimitedAccessDefendantController,
    )

  defendantModule.close()

  return {
    messageService,
    userService,
    courtService,
    pdfService,
    defendantModel,
    defendantService,
    defendantController,
    internalDefendantController,
    limitedAccessDefendantController,
  }
}
