import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { Case, CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { DeliverDefendantToCourtDto } from './dto/deliverDefendantToCourt.dto'
import { InternalUpdateDefendantDto } from './dto/internalUpdateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { DefendantNationalIdExistsGuard } from './guards/defendantNationalIdExists.guard'
import { Defendant } from './models/defendant.model'
import { DeliverResponse } from './models/deliver.response'
import { DefendantService } from './defendant.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal defendants')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(DefendantExistsGuard)
  @Post(
    `${messageEndpoint[MessageType.DELIVERY_TO_COURT_DEFENDANT]}/:defendantId`,
  )
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to court',
  })
  deliverDefendantToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDefendantToCourtDto: DeliverDefendantToCourtDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defendant ${defendantId} of case ${caseId} to court`,
    )

    return this.defendantService.deliverDefendantToCourt(
      theCase,
      defendant,
      deliverDefendantToCourtDto.user,
    )
  }

  @UseGuards(new CaseTypeGuard(indictmentCases), DefendantNationalIdExistsGuard)
  @Patch('defense/:defendantNationalId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates defendant information by case and national id',
  })
  updateDefendant(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() updatedDefendantChoice: InternalUpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating defendant info for ${caseId}`)

    return this.defendantService.updateRestricted(
      theCase,
      defendant,
      updatedDefendantChoice,
    )
  }
}
