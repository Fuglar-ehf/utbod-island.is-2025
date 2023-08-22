import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { MessageService } from '@island.is/judicial-system/message'

import { environment } from '../../../../environments'
import { UserService } from '../../user'
import { CourtService } from '../../court'
import { CaseService } from '../../case'
import { Defendant } from '../models/defendant.model'
import { DefendantService } from '../defendant.service'
import { DefendantController } from '../defendant.controller'
import { InternalDefendantController } from '../internalDefendant.controller'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../user/user.service')
jest.mock('../../court/court.service')
jest.mock('../../case/case.service')

export const createTestingDefendantModule = async () => {
  const defendantModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [DefendantController, InternalDefendantController],
    providers: [
      MessageService,
      UserService,
      CourtService,
      CaseService,
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

  const defendantModel = await defendantModule.resolve<typeof Defendant>(
    getModelToken(Defendant),
  )

  const defendantService = defendantModule.get<DefendantService>(
    DefendantService,
  )

  const defendantController = defendantModule.get<DefendantController>(
    DefendantController,
  )

  const internalDefendantController = defendantModule.get<InternalDefendantController>(
    InternalDefendantController,
  )

  defendantModule.close()

  return {
    messageService,
    userService,
    courtService,
    defendantModel,
    defendantService,
    defendantController,
    internalDefendantController,
  }
}
