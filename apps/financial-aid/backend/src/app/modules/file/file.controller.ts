import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath, RolesRule } from '@island.is/financial-aid/shared/lib'
import type { User } from '@island.is/financial-aid/shared/lib'

import { GetSignedUrlDto, CreateFilesDto } from './dto'
import { CreateFilesModel, SignedUrlModel } from './models'
import { FileService } from './file.service'
import { RolesGuard } from '../../guards/roles.guard'
import { CurrentUser, RolesRules } from '../../decorators'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { StaffGuard } from '../../guards/staff.guard'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller(`${apiBasePath}/file`)
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('url')
  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Scopes(MunicipalitiesFinancialAidScope.write)
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  createSignedUrl(
    @CurrentUser() user: User,
    @Body() getSignedUrl: GetSignedUrlDto,
  ): SignedUrlModel {
    return this.fileService.createSignedUrl(user.folder, getSignedUrl.fileName)
  }

  @Get('url/:id')
  @UseGuards(RolesGuard, StaffGuard)
  @RolesRules(RolesRule.VEITA)
  @Scopes(MunicipalitiesFinancialAidScope.read)
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  async createSignedUrlForId(@Param('id') id: string): Promise<SignedUrlModel> {
    return this.fileService.createSignedUrlForFileId(id)
  }

  @Get(':applicationId')
  @UseGuards(RolesGuard, StaffGuard)
  @RolesRules(RolesRule.VEITA)
  @Scopes(MunicipalitiesFinancialAidScope.read)
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url for all files for application id',
  })
  async createSignedUrlForAllFiles(
    @Param('applicationId') applicationId: string,
  ): Promise<SignedUrlModel[]> {
    return this.fileService.createSignedUrlForAllFilesId(applicationId)
  }

  @Post('')
  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Scopes(MunicipalitiesFinancialAidScope.write)
  @ApiCreatedResponse({
    type: CreateFilesModel,
    description: 'Uploads files',
  })
  async createFiles(
    @Body() createFiles: CreateFilesDto,
  ): Promise<CreateFilesModel> {
    return await this.fileService.createFiles(createFiles)
  }
}
