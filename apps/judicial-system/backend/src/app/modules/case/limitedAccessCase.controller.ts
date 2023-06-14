import { Response } from 'express'

import {
  BadRequestException,
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
  indictmentCases,
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
import { LimitedAccessCaseReceivedGuard } from './guards/limitedAccessCaseReceived.guard'
import { CaseDefenderGuard } from './guards/caseDefender.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { RequestSharedWithDefenderGuard } from './guards/requestSharedWithDefender.guard'
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
import { CaseEvent, EventService } from '../event'

@Controller('api')
@ApiTags('limited access cases')
export class LimitedAccessCaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly limitedAccessCaseService: LimitedAccessCaseService,
    private readonly eventService: EventService,

    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    LimitedAccessCaseReceivedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess')
  @ApiOkResponse({
    type: Case,
    description: 'Gets a limited set of properties of an existing case',
  })
  async getById(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @CurrentHttpUser() user: TUser,
  ): Promise<Case> {
    this.logger.debug(`Getting limitedAccess case ${caseId} by id`)

    if (!theCase.openedByDefender) {
      const updated = await this.limitedAccessCaseService.update(
        theCase,
        { openedByDefender: nowFactory() },
        user,
      )
      return updated
    }

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
  @Patch('case/:caseId/limitedAccess')
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
    LimitedAccessCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderTransitionRule)
  @Patch('case/:caseId/limitedAccess/state')
  @ApiOkResponse({
    type: Case,
    description: 'Updates the state of a case',
  })
  async transition(
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

    const updatedCase = await this.limitedAccessCaseService.update(
      theCase,
      update,
      user,
    )

    this.eventService.postEvent(
      (transition.transition as unknown) as CaseEvent,
      updatedCase,
    )

    return updatedCase
  }

  @UseGuards(TokenGuard)
  @Get('cases/limitedAccess/defender')
  @ApiOkResponse({
    type: User,
    description: 'Gets a defender by national id',
  })
  findDefenderByNationalId(
    @Query('nationalId') nationalId: string,
  ): Promise<User> {
    this.logger.debug(`Getting a defender by national id`)

    return this.limitedAccessCaseService.findDefenderByNationalId(nationalId)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    LimitedAccessCaseReceivedGuard,
    RequestSharedWithDefenderGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess/request')
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
    new CaseTypeGuard(indictmentCases),
    LimitedAccessCaseReceivedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess/caseFilesRecord/:policeCaseNumber')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets the case files record for an existing case as a pdf document',
  })
  async getCaseFilesRecordPdf(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the case files record for case ${caseId} and police case ${policeCaseNumber} as a pdf document`,
    )

    if (!theCase.policeCaseNumbers.includes(policeCaseNumber)) {
      throw new BadRequestException(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    }

    const pdf = await this.caseService.getCaseFilesRecordPdf(
      theCase,
      policeCaseNumber,
    )

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
  @Get('case/:caseId/limitedAccess/courtRecord')
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
  @Get('case/:caseId/limitedAccess/ruling')
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

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    LimitedAccessCaseReceivedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess/indictment')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the indictment for an existing case as a pdf document',
  })
  async getIndictmentPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the indictment for case ${caseId} as a pdf document`,
    )

    const pdf = await this.caseService.getIndictmentPdf(theCase)

    res.end(pdf)
  }
}
