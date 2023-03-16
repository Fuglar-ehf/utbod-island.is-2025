import { Injectable, Inject } from '@nestjs/common'
import { ValidationFailed } from '@island.is/nest/problem'
import {
  ApplicationTemplateHelper,
  validateAnswers,
} from '@island.is/application/core'
import {
  Application,
  FormValue,
  TemplateApi,
} from '@island.is/application/types'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { Unwrap } from '@island.is/shared/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { environment } from '../../../../environments'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import type { FormatMessage } from '@island.is/cms-translations'

const isRunningOnProductionEnvironment = () => {
  return (
    environment.production === true &&
    environment.name !== 'local' &&
    environment.name !== 'dev' &&
    environment.name !== 'staging'
  )
}

@Injectable()
export class ApplicationValidationService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async validateThatApplicationIsReady(
    application: Application,
    user: User,
  ): Promise<void> {
    const applicationTemplate = await getApplicationTemplateByTypeId(
      application.typeId,
    )

    if (!applicationTemplate) {
      throw new BadRequestException(
        `No template exists for type: ${application.typeId}`,
      )
    }

    await this.validateThatTemplateIsReady(applicationTemplate, user)
  }

  async isTemplateFeatureFlaggedReady(featureFlag: Features, user?: User) {
    return await this.featureFlagService.getValue(featureFlag, false, user)
  }

  // If configcat flag is present use that flag to determine if the template is ready
  // If configcat flag is not present, use the readyForProduction flag
  // TODO: Remove the readyForProduction flag and assume that applications that have no featureFlag are ready for production
  async isTemplateReady(
    template: Pick<
      Unwrap<typeof getApplicationTemplateByTypeId>,
      'readyForProduction' | 'featureFlag'
    >,
    user?: User,
  ): Promise<boolean> {
    if (template.featureFlag) {
      return await this.isTemplateFeatureFlaggedReady(
        template.featureFlag,
        user,
      )
    }
    // TODO: Remove this when readyForProduction is removed
    if (isRunningOnProductionEnvironment() && !template.readyForProduction) {
      {
        return false
      }
    }
    return true
  }

  async validateThatTemplateIsReady(
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    user?: User,
  ): Promise<void> {
    const results = await this.isTemplateReady(template, user)
    if (!results) {
      throw new BadRequestException(
        `Template ${template.type} is not ready for production`,
      )
    }
  }

  async validateApplicationSchema(
    application: Pick<Application, 'typeId'>,
    newAnswers: FormValue,
    formatMessage: FormatMessage,
    user: User,
  ): Promise<void> {
    const applicationTemplate = await getApplicationTemplateByTypeId(
      application.typeId,
    )

    if (applicationTemplate === null) {
      throw new BadRequestException(
        `No template exists for type: ${application.typeId}`,
      )
    }

    await this.validateThatTemplateIsReady(applicationTemplate, user)

    const schemaFormValidationError = validateAnswers({
      dataSchema: applicationTemplate.dataSchema,
      answers: newAnswers,
      isFullSchemaValidation: false,
      formatMessage,
    })

    if (schemaFormValidationError) {
      this.logger.error('Failed to validate schema', schemaFormValidationError)
      throw new ValidationFailed(schemaFormValidationError)
    }
  }

  async validateIncomingAnswers(
    application: Application,
    newAnswers: FormValue | undefined,
    nationalId: string,
    isStrict = true,
    formatMessage: FormatMessage,
  ): Promise<FormValue> {
    if (!newAnswers) {
      return {}
    }

    const template = await getApplicationTemplateByTypeId(application.typeId)
    const role = template.mapUserToRole(nationalId, application)

    if (!role) {
      throw new UnauthorizedException(
        'Current user does not have a role in this application state',
      )
    }

    const helper = new ApplicationTemplateHelper(application, template)
    const writableAnswersAndExternalData = helper.getWritableAnswersAndExternalData(
      role,
    )

    let trimmedAnswers: FormValue

    if (writableAnswersAndExternalData === 'all') {
      trimmedAnswers = newAnswers
    } else {
      if (
        isStrict &&
        (!writableAnswersAndExternalData ||
          !writableAnswersAndExternalData?.answers)
      ) {
        throw new ForbiddenException(
          `Current user is not permitted to update answers in this state: ${application.state}`,
        )
      }

      const permittedAnswers = writableAnswersAndExternalData?.answers ?? []
      trimmedAnswers = {}
      const illegalAnswers: string[] = []

      Object.keys(newAnswers).forEach((key) => {
        if (permittedAnswers.indexOf(key) === -1) {
          illegalAnswers.push(key)
        } else {
          trimmedAnswers[key] = newAnswers[key]
        }
      })

      if (isStrict && illegalAnswers.length > 0) {
        throw new ForbiddenException(
          `Current user is not permitted to update the following answers: ${illegalAnswers.toString()}`,
        )
      }
    }

    try {
      const errorMap = await helper.applyAnswerValidators(
        newAnswers,
        formatMessage,
      )
      if (errorMap) {
        throw new ValidationFailed(errorMap)
      }
    } catch (error) {
      this.logger.error('Failed to validate answers', error)
      throw error
    }

    return trimmedAnswers
  }

  async validateIncomingExternalDataProviders(
    application: Application,
    templateApis: TemplateApi[],
    nationalId: string,
  ): Promise<void> {
    if (!templateApis) {
      return
    }
    const template = await getApplicationTemplateByTypeId(application.typeId)
    const role = template.mapUserToRole(nationalId, application)
    if (!role) {
      throw new UnauthorizedException(
        'Current user does not have a role in this application state',
      )
    }
    const helper = new ApplicationTemplateHelper(application, template)
    const writableAnswersAndExternalData = helper.getWritableAnswersAndExternalData(
      role,
    )
    if (writableAnswersAndExternalData === 'all') {
      return
    }
    if (
      !writableAnswersAndExternalData ||
      !writableAnswersAndExternalData?.externalData
    ) {
      throw new BadRequestException(
        `Current user is not permitted to update external data in this state: ${application.state}`,
      )
    }
    const permittedDataProviders = writableAnswersAndExternalData.externalData

    const illegalDataProviders: string[] = []

    templateApis.forEach(({ externalDataId }) => {
      if (permittedDataProviders.indexOf(externalDataId) === -1) {
        illegalDataProviders.push(externalDataId)
      }
    })
    if (illegalDataProviders.length > 0) {
      throw new BadRequestException(
        `Current user is not permitted to update the following data providers: ${illegalDataProviders.toString()}`,
      )
    }
  }
}
