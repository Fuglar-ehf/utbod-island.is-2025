import { ReadableStreamBuffer } from 'stream-buffers'
import { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Inject,
  ForbiddenException,
  Query,
  ConflictException,
  Res,
  Header,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import {
  CaseState,
  CaseTransition,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesRules,
  RolesGuard,
  RolesRule,
  RulesType,
  TokenGuaard,
} from '@island.is/judicial-system/auth'

import { UserService } from '../user'
import { CreateCaseDto, TransitionCaseDto, UpdateCaseDto } from './dto'
import { Case, SignatureConfirmationResponse } from './models'
import { transitionCase } from './state'
import { isCaseBlockedFromUser } from './filters'
import { CaseService } from './case.service'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
const judgeRule = UserRole.JUDGE as RolesRule

// Allows registrars to perform any action
const registrarRule = UserRole.REGISTRAR as RolesRule

// Allows prosecutors to update a specific set of fields
const prosecutorUpdateRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: [
    'policeCaseNumber',
    'accusedNationalId',
    'accusedName',
    'accusedAddress',
    'accusedGender',
    'defenderName',
    'defenderEmail',
    'sendRequestToDefender',
    'court',
    'arrestDate',
    'requestedCourtDate',
    'requestedCustodyEndDate',
    'otherDemands',
    'lawsBroken',
    'custodyProvisions',
    'requestedCustodyRestrictions',
    'requestedOtherRestrictions',
    'caseFacts',
    'legalArguments',
    'comments',
    'prosecutorId',
  ],
} as RolesRule

// Allows judges to update a specific set of fields
const judgeUpdateRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD,
  dtoFields: [
    'defenderName',
    'defenderEmail',
    'setCourtCaseNumberManually',
    'courtCaseNumber',
    'courtDate',
    'courtRoom',
    'courtStartTime',
    'courtEndTime',
    'courtAttendees',
    'policeDemands',
    'courtDocuments',
    'accusedPleaDecision',
    'accusedPleaAnnouncement',
    'litigationPresentations',
    'ruling',
    'additionToConclusion',
    'decision',
    'custodyEndDate',
    'custodyRestrictions',
    'otherRestrictions',
    'isolationTo',
    'accusedAppealDecision',
    'accusedAppealAnnouncement',
    'prosecutorAppealDecision',
    'prosecutorAppealAnnouncement',
    'judgeId',
    'registrarId',
  ],
} as RolesRule

// Allows registrars to update a specific set of fields
const registrarUpdateRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: [
    'defenderName',
    'defenderEmail',
    'courtCaseNumber',
    'courtDate',
    'courtRoom',
    'courtStartTime',
    'courtEndTime',
    'courtAttendees',
    'policeDemands',
    'courtDocuments',
    'accusedPleaDecision',
    'accusedPleaAnnouncement',
    'litigationPresentations',
    'ruling',
    'decision',
    'custodyEndDate',
    'custodyRestrictions',
    'otherRestrictions',
    'accusedAppealDecision',
    'accusedAppealAnnouncement',
    'prosecutorAppealDecision',
    'prosecutorAppealAnnouncement',
    'judgeId',
    'registrarId',
  ],
} as RolesRule

// Allows prosecutors to open, submit and delete cases
const prosecutorTransitionRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.OPEN,
    CaseTransition.SUBMIT,
    CaseTransition.DELETE,
  ],
} as RolesRule

// Allows judges to receive, accept and reject cases
const judgeTransitionRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REJECT,
  ],
} as RolesRule

// Allows registrars to receive cases
const registrarTransitionRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.RECEIVE],
} as RolesRule

@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(CaseService)
    private readonly caseService: CaseService,
  ) {}

  private async findCaseById(id: string, user: User): Promise<Case> {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    if (isCaseBlockedFromUser(existingCase, user)) {
      throw new ForbiddenException(
        `User ${user.id} does not have access to case ${id}`,
      )
    }

    return existingCase
  }

  private async validateProsecutor(prosecutorId: string, existingCase: Case) {
    const user = await this.userService.findById(prosecutorId)

    if (!user) {
      throw new NotFoundException(`Prosecutor ${prosecutorId} does not exist`)
    }

    if (user.institutionId !== existingCase.prosecutor.institutionId) {
      throw new ForbiddenException(
        `Prosecutor ${prosecutorId} cannot be assigned to case ${existingCase.id}`,
      )
    }
  }

  @UseGuards(TokenGuaard)
  @Post('internal/case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  internalCreate(@Body() caseToCreate: CreateCaseDto): Promise<Case> {
    return this.caseService.create(caseToCreate)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  create(
    @CurrentHttpUser() user: User,
    @Body() caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    return this.caseService.create(caseToCreate, user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorUpdateRule, judgeUpdateRule, registrarUpdateRule)
  @Put('case/:id')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case> {
    // Make sure the user has access to this case
    const existingCase = await this.findCaseById(id, user)

    // Make sure a valid prosecutor is assigned to the case
    if (caseToUpdate.prosecutorId && existingCase.prosecutorId) {
      await this.validateProsecutor(caseToUpdate.prosecutorId, existingCase)
    }

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      // TODO: Find a more suitable exception to throw
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return updatedCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(
    prosecutorTransitionRule,
    judgeTransitionRule,
    registrarTransitionRule,
  )
  @Put('case/:id/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    // Use existingCase.modified when client is ready to send last modified timestamp with all updates

    const existingCase = await this.findCaseById(id, user)

    const state = transitionCase(transition.transition, existingCase.state)

    const update = { state }

    if (state === CaseState.DELETED) {
      update['parentCaseId'] = null
    }

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      update as UpdateCaseDto,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of the case with id ${id}`,
      )
    }

    return updatedCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  getAll(@CurrentHttpUser() user: User): Promise<Case[]> {
    return this.caseService.getAll(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  async getById(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<Case> {
    const existingCase = await this.findCaseById(id, user)

    return existingCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id/ruling')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.findCaseById(id, user)

    const pdf = await this.caseService.getRulingPdf(existingCase)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id/request')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the request for an existing case as a pdf document',
  })
  async getRequestPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.findCaseById(id, user)

    const pdf = await this.caseService.getRequestPdf(existingCase)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(judgeRule)
  @Post('case/:id/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a signature for an existing case',
  })
  async requestSignature(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.findCaseById(id, user)

    if (user?.id !== existingCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    try {
      const response = await this.caseService.requestSignature(existingCase)
      return res.status(201).send(response)
    } catch (error) {
      if (error instanceof DokobitError) {
        return res.status(error.status).json({
          code: error.code,
          message: error.message,
        })
      }

      throw error
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(judgeRule)
  @Get('case/:id/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested signature for an existing case',
  })
  async getSignatureConfirmation(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    const existingCase = await this.findCaseById(id, user)

    if (user?.id !== existingCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    return this.caseService.getSignatureConfirmation(
      existingCase,
      documentToken,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule)
  @Post('case/:id/extend')
  @ApiCreatedResponse({
    type: Case,
    description: 'Clones a new case based on an existing case',
  })
  async extend(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<Case> {
    const existingCase = await this.findCaseById(id, user)

    if (existingCase.childCase) {
      return existingCase.childCase
    }

    return this.caseService.extend(existingCase)
  }
}
