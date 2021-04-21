import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
  Optional,
  Query,
  UseGuards,
} from '@nestjs/common'
import omit from 'lodash/omit'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger'
import {
  Application as BaseApplication,
  callDataProviders,
  ApplicationTypes,
  FormValue,
  ApplicationTemplateHelper,
  ExternalData,
  ApplicationTemplateAPIAction,
  PdfTypes,
  ApplicationStatus,
  ApplicationIdentityServerScope,
} from '@island.is/application/core'
import { Unwrap, Locale } from '@island.is/shared/types'
import { IdsAuthGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import {
  getApplicationDataProviders,
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { TemplateAPIService } from '@island.is/application/template-api-modules'
import { mergeAnswers, DefaultEvents } from '@island.is/application/core'
import { IntlService } from '@island.is/api/domains/translations'

import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { FileService } from './files/file.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { CreatePdfDto } from './dto/createPdf.dto'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import { RequestFileSignatureDto } from './dto/requestFileSignature.dto'
import { UploadSignedFileDto } from './dto/uploadSignedFile.dto'
import {
  buildDataProviders,
  buildExternalData,
} from './utils/externalDataUtils'
import { ApplicationByIdPipe } from './tools/applicationById.pipe'
import {
  validateApplicationSchema,
  validateIncomingAnswers,
  validateIncomingExternalDataProviders,
  validateThatTemplateIsReady,
  isTemplateReady,
  validateThatApplicationIsReady,
} from './utils/validationUtils'
import { ApplicationSerializer } from './tools/application.serializer'
import { UpdateApplicationStateDto } from './dto/updateApplicationState.dto'
import { ApplicationResponseDto } from './dto/application.response.dto'
import { PresignedUrlResponseDto } from './dto/presignedUrl.response.dto'
import { RequestFileSignatureResponseDto } from './dto/requestFileSignature.response.dto'
import { UploadSignedFileResponseDto } from './dto/uploadSignedFile.response.dto'
import { AssignApplicationDto } from './dto/assignApplication.dto'
import { NationalId } from './tools/nationalId.decorator'
import { AuthorizationHeader } from './tools/authorizationHeader.decorator'
import { verifyToken } from './utils/tokenUtils'
import {
  DecodedAssignmentToken,
  StateChangeResult,
  TemplateAPIModuleActionResult,
} from './types'
import { CurrentLocale } from './utils/currentLocale'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('applications')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly templateAPIService: TemplateAPIService,
    private readonly fileService: FileService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue,
    private intlService: IntlService,
  ) {}

  @Scopes(ApplicationIdentityServerScope.read)
  @Get('applications/:id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ApplicationResponseDto> {
    const application = await this.applicationService.findOneById(id)

    if (!application) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    await validateThatApplicationIsReady(application as BaseApplication)

    return application
  }

  @Scopes(ApplicationIdentityServerScope.read)
  @Get('users/:nationalId/applications')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: `To get the applications for a specific user's national id.`,
    allowEmptyValue: false,
  })
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: 'string',
    description:
      'To filter applications by type. Comma-separated for multiple values.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'string',
    description:
      'To filter applications by status. Comma-separated for multiple values.',
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findAll(
    @NationalId() nationalId: string,
    @Query('typeId') typeId?: string,
    @Query('status') status?: string,
  ): Promise<ApplicationResponseDto[]> {
    const applications = await this.applicationService.findAllByNationalIdAndFilters(
      nationalId,
      typeId,
      status,
    )

    const templateTypeToIsReady: Partial<Record<ApplicationTypes, boolean>> = {}
    const filteredApplications = []

    for (const application of applications) {
      // We've already checked an application with this type and it is ready
      if (templateTypeToIsReady[application.typeId]) {
        filteredApplications.push(application)
      } else if (templateTypeToIsReady[application.typeId] === false) {
        // We've already checked an application with this type
        // and it is NOT ready so we will skip it
        continue
      }

      const applicationTemplate = await getApplicationTemplateByTypeId(
        application.typeId,
      )

      if (isTemplateReady(applicationTemplate)) {
        templateTypeToIsReady[application.typeId] = true
        filteredApplications.push(application)
      } else {
        templateTypeToIsReady[application.typeId] = false
      }
    }

    return filteredApplications
  }

  @Scopes(ApplicationIdentityServerScope.write)
  @Post('applications')
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async create(
    @Body()
    application: CreateApplicationDto,
    @NationalId()
    nationalId: string,
  ): Promise<ApplicationResponseDto> {
    const { typeId } = application
    const template = await getApplicationTemplateByTypeId(typeId)

    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${typeId}`,
      )
    }

    // TODO: verify template is ready from https://github.com/island-is/island.is/pull/3297

    // TODO: initial state should be required
    const initialState =
      template.stateMachineConfig.initial ??
      Object.keys(template.stateMachineConfig.states)[0]

    if (typeof initialState !== 'string') {
      throw new BadRequestException(
        `No initial state found for type: ${typeId}`,
      )
    }

    const applicationDto: Pick<
      BaseApplication,
      | 'answers'
      | 'applicant'
      | 'assignees'
      | 'attachments'
      | 'state'
      | 'status'
      | 'typeId'
    > = {
      answers: {},
      applicant: nationalId,
      assignees: [],
      attachments: {},
      state: initialState,
      status: ApplicationStatus.IN_PROGRESS,
      typeId: application.typeId,
    }

    return this.applicationService.create(applicationDto)
  }

  @Scopes(ApplicationIdentityServerScope.write)
  @Put('applications/assign')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async assignApplication(
    @Body() assignApplicationDto: AssignApplicationDto,
    @NationalId() nationalId: string,
    @AuthorizationHeader() authorization: string,
  ): Promise<ApplicationResponseDto> {
    const decodedToken = verifyToken<DecodedAssignmentToken>(
      assignApplicationDto.token,
    )

    if (decodedToken === null) {
      throw new BadRequestException('Invalid token')
    }

    const existingApplication = await this.applicationService.findOneById(
      decodedToken.applicationId,
    )

    if (existingApplication === null) {
      throw new NotFoundException('No application found')
    }

    if (existingApplication.state !== decodedToken.state) {
      throw new NotFoundException('Application no longer in assignable state')
    }

    // TODO check if assignee is still the same?
    // decodedToken.assignedEmail === get(existingApplication.answers, decodedToken.emailPath)
    // throw new BadRequestException('Invalid token')

    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    validateThatTemplateIsReady(template)

    const assignees = [nationalId]

    const mergedApplication: BaseApplication = {
      ...(existingApplication.toJSON() as BaseApplication),
      assignees,
    }

    const {
      hasChanged,
      hasError,
      error,
      application: updatedApplication,
    } = await this.changeState(
      mergedApplication,
      template,
      DefaultEvents.ASSIGN,
      authorization,
    )

    if (hasError) {
      throw new BadRequestException(error)
    }

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  @Scopes(ApplicationIdentityServerScope.write)
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
    @NationalId() nationalId: string,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const newAnswers = application.answers as FormValue
    const intl = await this.intlService.useIntl(namespaces, locale)

    await validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      nationalId,
      true,
      intl.formatMessage,
    )

    await validateApplicationSchema(
      existingApplication as BaseApplication,
      newAnswers,
      intl.formatMessage,
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

  @Scopes(ApplicationIdentityServerScope.write)
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
    @AuthorizationHeader() authorization: string,
    @NationalId() nationalId: string,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    await validateIncomingExternalDataProviders(
      existingApplication as BaseApplication,
      externalDataDto,
      nationalId,
    )
    const templateDataProviders = await getApplicationDataProviders(
      (existingApplication as BaseApplication).typeId,
    )

    const results = await callDataProviders(
      buildDataProviders(
        externalDataDto,
        templateDataProviders,
        authorization ?? '',
        locale,
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

  @Scopes(ApplicationIdentityServerScope.write)
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
    @NationalId() nationalId: string,
    @AuthorizationHeader() authorization: string,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const newAnswers = (updateApplicationStateDto.answers ?? {}) as FormValue
    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const intl = await this.intlService.useIntl(namespaces, locale)

    const permittedAnswers = await validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      nationalId,
      false,
      intl.formatMessage,
    )

    await validateApplicationSchema(
      existingApplication as BaseApplication,
      permittedAnswers,
      intl.formatMessage,
    )

    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      permittedAnswers,
    )

    const mergedApplication: BaseApplication = {
      ...(existingApplication.toJSON() as BaseApplication),
      answers: mergedAnswers,
    }

    const {
      hasChanged,
      hasError,
      error,
      application: updatedApplication,
    } = await this.changeState(
      mergedApplication,
      template,
      updateApplicationStateDto.event,
      authorization,
    )

    if (hasError) {
      throw new BadRequestException(error)
    }

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  async performActionOnApplication(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    authorization: string,
    action: ApplicationTemplateAPIAction,
  ): Promise<TemplateAPIModuleActionResult> {
    const {
      apiModuleAction,
      shouldPersistToExternalData,
      externalDataId,
      throwOnError,
    } = action

    const actionResult = await this.templateAPIService.performAction({
      templateId: template.type,
      type: apiModuleAction,
      props: {
        application,
        authorization,
      },
    })

    let updatedApplication: BaseApplication = application

    if (shouldPersistToExternalData) {
      const newExternalDataEntry: ExternalData = {
        [externalDataId || apiModuleAction]: {
          status: actionResult.success ? 'success' : 'failure',
          date: new Date(),
          data: actionResult.success
            ? (actionResult.response as ExternalData['data'])
            : actionResult.error,
        },
      }

      const {
        updatedApplication: withExternalData,
      } = await this.applicationService.updateExternalData(
        updatedApplication.id,
        updatedApplication.externalData,
        newExternalDataEntry,
      )

      updatedApplication = {
        ...updatedApplication,
        externalData: {
          ...updatedApplication.externalData,
          ...withExternalData.externalData,
        },
      }
    }

    if (!actionResult.success && throwOnError) {
      return {
        updatedApplication,
        hasError: true,
        error: actionResult.error,
      }
    }

    return {
      updatedApplication,
      hasError: false,
    }
  }

  async changeState(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    event: string,
    authorization: string,
  ): Promise<StateChangeResult> {
    const helper = new ApplicationTemplateHelper(application, template)
    const onExitStateAction = helper.getOnExitStateAPIAction(application.state)
    const status = helper.getApplicationStatus()
    let updatedApplication: BaseApplication = application

    if (onExitStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        authorization,
        onExitStateAction,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasChanged: false,
          application: updatedApplication,
          error,
          hasError: true,
        }
      }
    }

    const [
      hasChanged,
      newState,
      withUpdatedState,
    ] = new ApplicationTemplateHelper(updatedApplication, template).changeState(
      event,
    )
    updatedApplication = {
      ...updatedApplication,
      answers: withUpdatedState.answers,
      assignees: withUpdatedState.assignees,
      state: withUpdatedState.state,
    }

    if (!hasChanged) {
      return {
        hasChanged: false,
        hasError: false,
        application: updatedApplication,
      }
    }

    const onEnterStateAction = new ApplicationTemplateHelper(
      updatedApplication,
      template,
    ).getOnEntryStateAPIAction(newState)

    if (onEnterStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        authorization,
        onEnterStateAction,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasError: true,
          hasChanged: false,
          error,
          application,
        }
      }
    }

    try {
      const update = await this.applicationService.updateApplicationState(
        application.id,
        newState,
        updatedApplication.answers,
        updatedApplication.assignees,
        status,
      )

      updatedApplication = update.updatedApplication as BaseApplication
    } catch (e) {
      return {
        hasChanged: false,
        hasError: true,
        application,
        error: 'Could not update application',
      }
    }

    return {
      hasChanged: true,
      application: updatedApplication,
      hasError: false,
    }
  }

  @Scopes(ApplicationIdentityServerScope.write)
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

  @Scopes(ApplicationIdentityServerScope.write)
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

  @Scopes(ApplicationIdentityServerScope.write)
  @Put('applications/:id/createPdf')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to create a pdf for',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: PresignedUrlResponseDto })
  async createPdf(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    application: Application,
    @Body() input: CreatePdfDto,
  ): Promise<PresignedUrlResponseDto> {
    const url = await this.fileService.createPdf(application, input.type)

    return { url }
  }

  @Scopes(ApplicationIdentityServerScope.write)
  @Put('applications/:id/requestFileSignature')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description:
      'The id of the application which the file signature is requested for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: RequestFileSignatureResponseDto })
  async requestFileSignature(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    application: Application,
    @Body() input: RequestFileSignatureDto,
  ): Promise<RequestFileSignatureResponseDto> {
    const {
      controlCode,
      documentToken,
    } = await this.fileService.requestFileSignature(application, input.type)

    return { controlCode, documentToken }
  }

  @Scopes(ApplicationIdentityServerScope.write)
  @Put('applications/:id/uploadSignedFile')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application which the file was created for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UploadSignedFileResponseDto })
  async uploadSignedFile(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    application: Application,
    @Body() input: UploadSignedFileDto,
  ): Promise<UploadSignedFileResponseDto> {
    await this.fileService.uploadSignedFile(
      application,
      input.documentToken,
      input.type,
    )

    return {
      documentSigned: true,
    }
  }

  @Scopes(ApplicationIdentityServerScope.read)
  @Get('applications/:id/:pdfType/presignedUrl')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application which the file was created for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: PresignedUrlResponseDto })
  async getPresignedUrl(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    application: Application,
    @Param('pdfType') type: PdfTypes,
  ): Promise<PresignedUrlResponseDto> {
    const url = await this.fileService.getPresignedUrl(application, type)

    return { url }
  }
}
