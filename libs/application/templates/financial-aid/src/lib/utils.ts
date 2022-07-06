import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'

import {
  FamilyStatus,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  Municipality,
} from '@island.is/financial-aid/shared/lib'

import {
  ApproveOptions,
  CurrentApplication,
  FAApplication,
  OverrideAnswerSchema,
  UploadFileType,
} from '..'
import { UploadFile } from '@island.is/island-ui/core'
import { ApplicationStates } from './constants'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)
export const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return Boolean(phone && phone.isValid())
}
export const isValidNationalId = (value: string) => kennitala.isValid(value)

export function hasSpouseCheck(context: ApplicationContext) {
  const {
    externalData,
    answers,
  } = (context.application as unknown) as FAApplication
  return hasSpouse(answers, externalData)
}

export const hasSpouse = (
  answers: FAApplication['answers'],
  externalData: FAApplication['externalData'],
) => {
  const nationalRegistrySpouse =
    externalData.nationalRegistry?.data?.applicant?.spouse

  const unregisteredCohabitation =
    answers?.relationshipStatus?.unregisteredCohabitation

  return (
    Boolean(nationalRegistrySpouse) ||
    unregisteredCohabitation === ApproveOptions.Yes
  )
}

export function isMuncipalityNotRegistered(context: ApplicationContext) {
  const { externalData } = context.application

  const municipality = getValueViaPath(
    externalData,
    `nationalRegistry.data.municipality.`,
  ) as Municipality | null
  return municipality == null
}

export const encodeFilenames = (filename: string) =>
  filename && encodeURI(filename.normalize().replace(/ +/g, '_'))

export function findFamilyStatus(
  answers: FAApplication['answers'],
  externalData: FAApplication['externalData'],
) {
  switch (true) {
    case martialStatusTypeFromMartialCode(
      externalData.nationalRegistry?.data?.applicant?.spouse?.maritalStatus,
    ) === MartialStatusType.MARRIED:
      return FamilyStatus.MARRIED
    case externalData.nationalRegistry?.data?.applicant?.spouse != null:
      return FamilyStatus.COHABITATION
    case answers?.relationshipStatus?.unregisteredCohabitation ===
      ApproveOptions.Yes:
      return FamilyStatus.UNREGISTERED_COBAHITATION
    default:
      return FamilyStatus.NOT_COHABITATION
  }
}

export function hasActiveCurrentApplication(context: ApplicationContext) {
  const { externalData } = context.application
  const dataProvider = getValueViaPath(
    externalData,
    'veita.data',
  ) as CurrentApplication
  return dataProvider.currentApplicationId != null
}

export const hasFiles = (
  fileType: UploadFileType,
  answers: OverrideAnswerSchema,
) => {
  const files = answers[fileType as keyof OverrideAnswerSchema] as UploadFile[]
  return files && files.length > 0
}

export const waitingForSpouse = (state: string) => {
  return (
    state === ApplicationStates.SPOUSE ||
    state === ApplicationStates.PREREQUISITESSPOUSE
  )
}
