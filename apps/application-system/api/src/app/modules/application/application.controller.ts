import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
  Optional,
  UseGuards,
  Req,
} from '@nestjs/common'

import omit from 'lodash/omit'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { WhereOptions } from 'sequelize/types'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger'
import { Op } from 'sequelize'
import {
  Application as BaseApplication,
  callDataProviders,
  ApplicationTypes,
  FormValue,
  ApplicationTemplateHelper,
  ExternalData,
} from '@island.is/application/core'
// import { IdsAuthGuard, ScopesGuard, User } from '@island.is/auth-nest-tools'
import {
  getApplicationDataProviders,
  getApplicationTemplateByTypeId,
} from '@island.is/application/template-loader'
import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { mergeAnswers } from '@island.is/application/core'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import {
  buildDataProviders,
  buildExternalData,
} from './utils/externalDataUtils'
import { ApplicationByIdPipe } from './tools/applicationById.pipe'
import {
  validateApplicationSchema,
  validateIncomingAnswers,
  validateIncomingExternalDataProviders,
} from './utils/validationUtils'
import { ApplicationSerializer } from './tools/application.serializer'
import { UpdateApplicationStateDto } from './dto/updateApplicationState.dto'
import { ApplicationResponseDto } from './dto/application.response.dto'
import { EmailService } from '@island.is/email-service'

// @UseGuards(IdsAuthGuard, ScopesGuard) TODO uncomment when IdsAuthGuard is fixes, always returns Unauthorized atm
@ApiTags('applications')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly emailService: EmailService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue,
  ) {}

  @Get('applications/:id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ApplicationResponseDto> {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return application
  }

  // TODO REMOVE
  @Get()
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findAll(
    @Query('typeId') typeId: string,
  ): Promise<ApplicationResponseDto[]> {
    if (typeId) {
      return this.applicationService.findAllByType(typeId as ApplicationTypes)
    } else {
      return this.applicationService.findAll()
    }
  }

  @Get('applicants/:nationalRegistryId/applications')
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findApplicantApplications(
    @Param('nationalRegistryId') nationalRegistryId: string,
    // @Req() request: Request,
    @Query('typeId') typeId?: string,
  ): Promise<ApplicationResponseDto[]> {
    // const user = request.user as User

    const whereOptions: WhereOptions = {
      // applicant: user.nationalId, TODO use this when user is in the request
      applicant: nationalRegistryId,
    }

    if (typeId) {
      whereOptions.typeId = typeId
    }

    return this.applicationService.findAll({
      where: whereOptions,
    })
  }

  @Get('assignees/:nationalRegistryId/applications')
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findAssigneeApplications(
    @Param('nationalRegistryId') nationalRegistryId: string,
    @Query('typeId') typeId?: string,
  ): Promise<Application[]> {
    const whereOptions: WhereOptions = {
      assignees: {
        [Op.contains]: [nationalRegistryId],
      },
    }

    if (typeId) {
      whereOptions.typeId = typeId
    }

    return this.applicationService.findAll({
      where: whereOptions,
    })
  }

  @Post('applications')
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async create(
    @Body()
    application: CreateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    // TODO not post the state, it should follow the initialstate of the machine
    await validateApplicationSchema(
      application,
      application.answers as FormValue,
    )

    return this.applicationService.create(application)
  }

  @Put('applications/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async update(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body()
    application: UpdateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    const newAnswers = application.answers as FormValue
    await validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
    )

    await validateApplicationSchema(
      existingApplication as BaseApplication,
      newAnswers,
    )
    const mergedAnswers = mergeAnswers(existingApplication.answers, newAnswers)
    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        ...application,
        answers: mergedAnswers,
      },
    )

    return updatedApplication
  }

  @Put('applications/:id/externalData')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the external data for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async updateExternalData(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body()
    externalDataDto: PopulateExternalDataDto,
    @Req() req: Request,
  ): Promise<ApplicationResponseDto> {
    await validateIncomingExternalDataProviders(
      existingApplication as BaseApplication,
      externalDataDto,
    )
    const templateDataProviders = await getApplicationDataProviders(
      (existingApplication as BaseApplication).typeId,
    )
    const headers = (req.headers as unknown) as { authorization?: string }

    const results = await callDataProviders(
      buildDataProviders(
        externalDataDto,
        templateDataProviders,
        headers.authorization ?? '',
      ),
      existingApplication as BaseApplication,
    )
    const {
      updatedApplication,
    } = await this.applicationService.updateExternalData(
      existingApplication.id,
      existingApplication.externalData as ExternalData,
      buildExternalData(externalDataDto, results),
    )
    if (!updatedApplication) {
      throw new NotFoundException(
        `An application with the id ${existingApplication.id} does not exist`,
      )
    }

    return updatedApplication
  }

  @Put('applications/:id/submit')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the state for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async submitApplication(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() updateApplicationStateDto: UpdateApplicationStateDto,
  ): Promise<ApplicationResponseDto> {
    const template = await getApplicationTemplateByTypeId(
      existingApplication.typeId as ApplicationTypes,
    )
    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const newAnswers = (updateApplicationStateDto.answers ?? {}) as FormValue

    const permittedAnswers = await validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      false,
    )

    await validateApplicationSchema(
      existingApplication as BaseApplication,
      permittedAnswers,
    )
    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      permittedAnswers,
    )

    const helper = new ApplicationTemplateHelper(
      {
        ...(existingApplication.toJSON() as BaseApplication),
        answers: mergedAnswers,
      } as BaseApplication,
      template,
    )

    const [
      hasChanged,
      newState,
      newApplication,
    ] = helper.changeState(updateApplicationStateDto.event, (emailTemplate) =>
      this.emailService.sendEmail(emailTemplate),
    )

    if (hasChanged) {
      const {
        updatedApplication,
      } = await this.applicationService.updateApplicationState(
        existingApplication.id,
        newState, // TODO maybe ban more complicated states....
        newApplication.answers,
        newApplication.assignees,
      )

      return updatedApplication
    }

    return existingApplication
  }

  @Put('applications/:id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the attachments for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async addAttachment(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() input: AddAttachmentDto,
  ): Promise<ApplicationResponseDto> {
    const { key, url } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: {
          ...existingApplication.attachments,
          [key]: url,
        },
      },
    )

    await this.uploadQueue.add('upload', {
      applicationId: existingApplication.id,
      attachmentUrl: url,
    })

    return updatedApplication
  }

  @Delete('applications/:id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to delete attachment(s) from.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async deleteAttachment(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() input: DeleteAttachmentDto,
  ): Promise<ApplicationResponseDto> {
    const { key } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: omit(existingApplication.attachments, key),
      },
    )

    return updatedApplication
  }
}
