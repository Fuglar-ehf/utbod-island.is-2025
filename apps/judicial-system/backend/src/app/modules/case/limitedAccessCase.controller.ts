import { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/judicial-system/auth'
import {
  CaseAppealState,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { defenderRule } from '../../guards'
import { User } from '../user'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { LimitedAccessCaseExistsGuard } from './guards/limitedAccessCaseExists.guard'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CaseScheduledGuard } from './guards/caseScheduled.guard'
import { CaseDefenderGuard } from './guards/caseDefender.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { defenderTransitionRule, defenderUpdateRule } from './guards/rolesRules'
import { CurrentCase } from './guards/case.decorator'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { TransitionCaseDto } from './dto/transitionCase.dto'
import { Case } from './models/case.model'
import { transitionCase } from './state/case.state'
import { CaseService } from './case.service'
import {
  LimitedAccessCaseService,
  LimitedAccessUpdateCase,
} from './limitedAccessCase.service'

@Controller('api/case/:caseId/limitedAccess')
@ApiTags('limited access cases')
export class LimitedAccessCaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly limitedAccessCaseService: LimitedAccessCaseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    CaseScheduledGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get()
  @ApiOkResponse({
    type: Case,
    description: 'Gets a limited set of properties of an existing case',
  })
  getById(@Param('caseId') caseId: string, @CurrentCase() theCase: Case): Case {
    this.logger.debug(`Getting limitedAccess case ${caseId} by id`)

    return theCase
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderUpdateRule)
  @Patch()
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  update(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Body() updateDto: UpdateCaseDto,
  ): Promise<Case> {
    this.logger.debug(`Updating limitedAccess case ${caseId}`)

    const update: LimitedAccessUpdateCase = updateDto

    if (update.defendantStatementDate) {
      update.defendantStatementDate = nowFactory()
    }

    return this.limitedAccessCaseService.update(theCase, update, user)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderTransitionRule)
  @Patch('state')
  @ApiOkResponse({
    type: Case,
    description: 'Updates the state of a case',
  })
  transition(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    this.logger.debug(
      `Transitioning case ${caseId} to ${transition.transition}`,
    )

    const update: LimitedAccessUpdateCase = transitionCase(
      transition.transition,
      theCase.state,
      theCase.appealState,
    )

    if (update.appealState === CaseAppealState.APPEALED) {
      update.accusedPostponedAppealDate = nowFactory()
    }

    return this.limitedAccessCaseService.update(theCase, update, user)
  }

  @UseGuards(TokenGuard, LimitedAccessCaseExistsGuard)
  @Get('defender')
  @ApiOkResponse({
    type: User,
    description: 'Gets a case defender by national id',
  })
  findDefenderByNationalId(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Query('nationalId') nationalId: string,
  ): User {
    this.logger.debug(`Getting a defender by national id from case ${caseId}`)

    return this.limitedAccessCaseService.findDefenderNationalId(
      theCase,
      nationalId,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseScheduledGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('request')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the request for an existing case as a pdf document',
  })
  async getRequestPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the request for case ${caseId} as a pdf document`,
    )

    const pdf = await this.caseService.getRequestPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('courtRecord')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the court record for an existing case as a pdf document',
  })
  async getCourtRecordPdf(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the court record for case ${caseId} as a pdf document`,
    )

    const pdf = await this.caseService.getCourtRecordPdf(theCase, user)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('ruling')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`Getting the ruling for case ${caseId} as a pdf document`)

    const pdf = await this.caseService.getRulingPdf(theCase)

    res.end(pdf)
  }
}
