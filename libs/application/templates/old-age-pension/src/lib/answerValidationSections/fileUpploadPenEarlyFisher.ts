import { Application, Answer } from '@island.is/application/types'

import * as kennitala from 'kennitala'
import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from '../messages'
import {
  getAgeBetweenTwoDates,
  getApplicationAnswers,
} from '../oldAgePensionUtils'
import {
  AnswerValidationConstants,
  ApplicationType,
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
  YES,
} from '../constants'
import { buildError } from './utils'

export const fileUpploadPenEarlyFisher = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOADPENEARLYFISHER } = AnswerValidationConstants

  const {
    selectedMonth,
    selectedYear,
    applicationType,
  } = getApplicationAnswers(application.answers)
  const dateOfBirth = kennitala.info(application.applicant).birthday

  const dateOfBirth00 = new Date(
    dateOfBirth.getFullYear(),
    dateOfBirth.getMonth(),
  )
  const selectedDate = new Date(+selectedYear, +selectedMonth)
  const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

  if (obj.pension) {
    if (isEmpty((obj as { pension: unknown[] }).pension)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADPENEARLYFISHER}.pension`,
      )
    }
  }

  if (
    age >= earlyRetirementMinAge &&
    age <= earlyRetirementMaxAge &&
    obj.earlyRetirement
  ) {
    if (isEmpty((obj as { earlyRetirement: unknown[] }).earlyRetirement)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADPENEARLYFISHER}.earlyRetirement`,
      )
    }
  }

  if (applicationType === ApplicationType.FISHERMEN && obj.fishermen) {
    if (isEmpty((obj as { fishermen: unknown[] }).fishermen)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADPENEARLYFISHER}.fishermen`,
      )
    }
  }

  return undefined
}
