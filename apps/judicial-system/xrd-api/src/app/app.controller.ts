import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { Get } from '@nestjs/common'
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyersService, LawyerType } from '@island.is/judicial-system/lawyers'

import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { SubpoenaResponse } from './models/subpoena.response'
import { CreateCaseDto } from './app.dto'
import { EventInterceptor } from './app.interceptor'
import { Case, Defender } from './app.model'
import { AppService } from './app.service'
@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly lawyersService: LawyersService,
  ) {}

  @UseInterceptors(EventInterceptor)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a case')

    return this.appService.create(caseToCreate).then((createdCase) => {
      this.logger.info(`Case ${createdCase.id} created`)

      return createdCase
    })
  }

  @Get('defenders')
  @ApiResponse({ status: 500, description: 'Failed to retrieve defenders' })
  async getLawyers(): Promise<Defender[]> {
    try {
      this.logger.debug('Retrieving litigators from lawyer registry')

      const lawyers = await this.lawyersService.getLawyers(
        LawyerType.LITIGATORS,
      )

      return lawyers.map((lawyer) => ({
        nationalId: lawyer.SSN,
        name: lawyer.Name,
        practice: lawyer.Practice,
      }))
    } catch (error) {
      this.logger.error('Failed to retrieve lawyers', error)
      throw new InternalServerErrorException('Failed to retrieve lawyers')
    }
  }

  @Get('case/:caseId/subpoena/:nationalId')
  @ApiResponse({ status: 500, description: 'Failed to retrieve subpoena' })
  async getSubpoena(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @Param('nationalId') nationalId: string,
  ): Promise<SubpoenaResponse> {
    this.logger.debug(`Getting subpoena by case id ${caseId}`)

    return this.appService.getSubpoena(caseId, nationalId)
  }

  @Patch('case/:caseId/subpoena/:nationalId')
  @ApiResponse({ status: 500, description: 'Failed to update subpoena' })
  async updateSubpoena(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @Param('nationalId') nationalId: string,
    @Body() updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    this.logger.debug(`Updating subpoena for ${caseId}`)

    return this.appService.updateSubpoena(caseId, nationalId, updateSubpoena)
  }
}
