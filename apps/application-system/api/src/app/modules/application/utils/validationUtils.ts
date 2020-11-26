import {
  Application,
  ApplicationTemplateHelper,
  FormValue,
  validateAnswers,
} from '@island.is/application/core'
import { BadRequestException } from '@nestjs/common'

import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

import { PopulateExternalDataDto } from '../dto/populateExternalData.dto'
import { environment } from '../../../../environments'

export async function validateApplicationSchema(
  application: Pick<Application, 'typeId'>,
  newAnswers: FormValue,
) {
  const applicationTemplate = await getApplicationTemplateByTypeId(
    application.typeId,
  )
  if (applicationTemplate === null) {
    throw new BadRequestException(
      `No template exists for type: ${application.typeId}`,
    )
  } else if (
    environment.environment === 'production' &&
    !applicationTemplate.readyForProduction
  ) {
    throw new BadRequestException(
      `Template ${application.typeId} is not ready for production`,
    )
  }
  const schemaFormValidationError = validateAnswers(
    applicationTemplate.dataSchema,
    newAnswers,
    false,
  )

  if (schemaFormValidationError) {
    // TODO improve error message
    throw new BadRequestException(`Schema validation has failed`)
  }
}

export async function validateIncomingAnswers(
  application: Application,
  newAnswers: FormValue | undefined,
  isStrict = true,
): Promise<FormValue> {
  if (!newAnswers) {
    return {}
  }
  const template = await getApplicationTemplateByTypeId(application.typeId)
  const helper = new ApplicationTemplateHelper(application, template)
  const writableAnswersAndExternalData = helper.getWritableAnswersAndExternalData(
    // TODO we really really need the token to get the national id
    application.state === 'inReview' ? 'reviewer' : 'applicant',
  )
  if (writableAnswersAndExternalData === 'all') {
    return newAnswers
  }
  if (
    isStrict &&
    (!writableAnswersAndExternalData ||
      !writableAnswersAndExternalData?.answers)
  ) {
    console.log('im going to throw an error here', application.state)
    throw new BadRequestException(
      `Current user is not permitted to update answers in this state: ${application.state}`,
    )
  }
  const permittedAnswers = writableAnswersAndExternalData?.answers ?? []
  const trimmedAnswers: FormValue = {}
  const illegalAnswers: string[] = []

  Object.keys(newAnswers).forEach((key) => {
    if (permittedAnswers.indexOf(key) === -1) {
      illegalAnswers.push(key)
    } else {
      trimmedAnswers[key] = newAnswers[key]
    }
  })
  if (isStrict && illegalAnswers.length > 0) {
    throw new BadRequestException(
      `Current user is not permitted to update the following answers: ${illegalAnswers.toString()}`,
    )
  }
  return trimmedAnswers
}
// TODO
export async function validateIncomingExternalDataProviders(
  application: Application,
  providerDto: PopulateExternalDataDto,
) {
  const { dataProviders } = providerDto
  if (!dataProviders.length) {
    return
  }
  const template = await getApplicationTemplateByTypeId(application.typeId)
  const helper = new ApplicationTemplateHelper(application, template)
  const writableAnswersAndExternalData = helper.getWritableAnswersAndExternalData(
    // TODO we really really need the token to get the national id
    application.state === 'inReview' ? 'reviewer' : 'applicant',
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

  dataProviders.forEach(({ id }) => {
    if (permittedDataProviders.indexOf(id) === -1) {
      illegalDataProviders.push(id)
    }
  })
  if (illegalDataProviders.length > 0) {
    throw new BadRequestException(
      `Current user is not permitted to update the following data providers: ${illegalDataProviders.toString()}`,
    )
  }
}
