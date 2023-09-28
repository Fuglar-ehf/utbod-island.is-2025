import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import {
  LimitedAccessCaseExistsGuard,
  CaseDefenderGuard,
  CaseCompletedGuard,
  CurrentCase,
  Case,
  CaseTypeGuard,
} from '../case'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { LimitedAccessViewCaseFileGuard } from './guards/limitedAccessViewCaseFile.guard'
import { LimitedAccessWriteCaseFileGuard } from './guards/limitedAccessWriteCaseFile.guard'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { CreateFileDto } from './dto/createFile.dto'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { FileService } from './file.service'

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  LimitedAccessCaseExistsGuard,
  CaseCompletedGuard,
  CaseDefenderGuard,
)
@Controller('api/case/:caseId/limitedAccess')
@ApiTags('files')
export class LimitedAccessFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(new CaseTypeGuard([...restrictionCases, ...investigationCases]))
  @RolesRules(defenderRule)
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  createPresignedPost(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.fileService.createPresignedPost(theCase, createPresignedPost)
  }

  @UseGuards(
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    LimitedAccessWriteCaseFileGuard,
  )
  @RolesRules(defenderRule)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.fileService.createCaseFile(theCase, createFile)
  }

  @UseGuards(CaseFileExistsGuard, LimitedAccessViewCaseFileGuard)
  @RolesRules(defenderRule)
  @Get('file/:fileId/url')
  @ApiOkResponse({
    type: SignedUrl,
    description: 'Gets a signed url for a case file',
  })
  getCaseFileSignedUrl(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<SignedUrl> {
    this.logger.debug(
      `Getting a signed url for file ${fileId} of case ${caseId}`,
    )

    return this.fileService.getCaseFileSignedUrl(caseFile)
  }

  @UseGuards(
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseFileExistsGuard,
    LimitedAccessWriteCaseFileGuard,
  )
  @RolesRules(defenderRule)
  @Delete('file/:fileId')
  @ApiOkResponse({
    type: DeleteFileResponse,
    description: 'Deletes a case file',
  })
  deleteCaseFile(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeleteFileResponse> {
    this.logger.debug(`Deleting file ${fileId} of case ${caseId}`)

    return this.fileService.deleteCaseFile(caseFile)
  }
}
