import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { Case } from '../case/models/case.model'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { Defendant } from '../defendant/models/defendant.model'
import { DeliverDto } from './dto/deliver.dto'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { PoliceSubpoenaExistsGuard } from './guards/policeSubpoenaExists.guard'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import { SubpoenaExistsGuard } from './guards/subpoenaExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'
import { SubpoenaService } from './subpoena.service'

@Controller('api/internal')
@ApiTags('internal subpoenas')
@UseGuards(TokenGuard)
export class InternalSubpoenaController {
  constructor(
    private readonly subpoenaService: SubpoenaService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(PoliceSubpoenaExistsGuard)
  @Patch('subpoena/:subpoenaId')
  updateSubpoena(
    @Param('subpoenaId') subpoenaId: string,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() update: UpdateSubpoenaDto,
  ): Promise<Subpoena> {
    this.logger.debug(`Updating subpoena by subpoena id ${subpoenaId}`)

    return this.subpoenaService.update(subpoena, update)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_POLICE_SUBPOENA]
    }/:defendantId/:subpoenaId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a subpoena to police',
  })
  deliverSubpoenaToPolice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena ${subpoenaId} to police for defendant ${defendantId} of case ${caseId}`,
    )

    return this.subpoenaService.deliverSubpoenaToPolice(
      theCase,
      defendant,
      subpoena,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_POLICE_SUBPOENA_REVOCATION]
    }/:defendantId/:subpoenaId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers subpoena revocation to police',
  })
  deliverSubpoenaRevokedToPolice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena revocation of ${subpoenaId} to police for defendant ${defendantId} of case ${caseId}`,
    )

    return this.subpoenaService.deliverSubpoenaRevokedToPolice(
      theCase,
      subpoena,
      deliverDto.user,
    )
  }
}
