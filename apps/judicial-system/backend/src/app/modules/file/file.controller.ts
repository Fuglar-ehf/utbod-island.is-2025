import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  CaseAppealDecision,
  CaseState,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { CaseService } from '../case'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
} from './models'
import { FileService } from './file.service'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
const judgeRule = UserRole.JUDGE as RolesRule

// Allows registrars to perform any action
const registrarRule = UserRole.REGISTRAR as RolesRule

const completedCaseStates = [CaseState.ACCEPTED, CaseState.REJECTED]

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly caseService: CaseService,
  ) {}

  @RolesRules(prosecutorRule)
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  async createCasePresignedPost(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (completedCaseStates.includes(existingCase.state)) {
      throw new ForbiddenException('Files cannot be added to a completed case')
    }

    return this.fileService.createCasePresignedPost(
      existingCase.id,
      createPresignedPost,
    )
  }

  @RolesRules(prosecutorRule)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (completedCaseStates.includes(existingCase.state)) {
      throw new ForbiddenException('Files cannot be added to a completed case')
    }

    return this.fileService.createCaseFile(existingCase.id, createFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('files')
  @ApiOkResponse({
    type: CaseFile,
    isArray: true,
    description: 'Gets all existing files for an existing case',
  })
  async getAllCaseFiles(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
  ): Promise<CaseFile[]> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    return this.fileService.getAllCaseFiles(existingCase.id)
  }

  @RolesRules(prosecutorRule)
  @Delete('file/:id')
  @ApiOkResponse({
    type: DeleteFileResponse,
    description: 'Deletes a file',
  })
  async deleteCaseFile(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<DeleteFileResponse> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (completedCaseStates.includes(existingCase.state)) {
      throw new ForbiddenException(
        'Files cannot be deleted from a completed case',
      )
    }

    const file = await this.fileService.findById(id)

    if (!file || file.caseId !== existingCase.id) {
      throw new NotFoundException(
        `File ${id} of case ${existingCase.id} does not exist`,
      )
    }

    return this.fileService.deleteCaseFile(existingCase.id, file)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('file/:id/url')
  @ApiOkResponse({
    type: PresignedPost,
    description: 'Gets a signed url for an existing file',
  })
  async getCaseFileSignedUrl(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<SignedUrl> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (user.role === UserRole.JUDGE) {
      if (existingCase.state === CaseState.RECEIVED) {
        if (user.id !== existingCase.judgeId) {
          throw new ForbiddenException(
            `User ${user.id} is not the assigned judge of case ${existingCase.id}`,
          )
        }

        // The assigned judge can get files of received cases
      } else if (
        !completedCaseStates.includes(existingCase.state) ||
        (existingCase.prosecutorAppealDecision !== CaseAppealDecision.APPEAL &&
          existingCase.accusedAppealDecision !== CaseAppealDecision.APPEAL &&
          !existingCase.prosecutorPostponedAppealDate &&
          !existingCase.accusedPostponedAppealDate)
      ) {
        throw new ForbiddenException(
          'Judges can only get files of appealed cases or uncompleted received cases they have been assigned to',
        )
      }
    }

    if (user.role === UserRole.REGISTRAR) {
      if (
        !completedCaseStates.includes(existingCase.state) ||
        (existingCase.prosecutorAppealDecision !== CaseAppealDecision.APPEAL &&
          existingCase.accusedAppealDecision !== CaseAppealDecision.APPEAL &&
          !existingCase.prosecutorPostponedAppealDate &&
          !existingCase.accusedPostponedAppealDate)
      ) {
        throw new ForbiddenException(
          'Registrars can only get files of appealed cases',
        )
      }
    }

    const file = await this.fileService.findById(id)

    if (!file || file.caseId !== existingCase.id) {
      throw new NotFoundException(
        `File ${id} of case ${existingCase.id} does not exist`,
      )
    }

    return this.fileService.getCaseFileSignedUrl(existingCase.id, file)
  }
}
