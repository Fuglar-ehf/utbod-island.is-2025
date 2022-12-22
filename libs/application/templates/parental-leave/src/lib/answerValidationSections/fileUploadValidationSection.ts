import { Answer, Application } from '@island.is/application/types'
import {
  AnswerValidationConstants,
  PARENTAL_GRANT_STUDENTS,
  SINGLE,
  UnEmployedBenefitTypes,
  YES,
} from '../../constants'
import { getApplicationAnswers } from '../parentalLeaveUtils'
import isEmpty from 'lodash/isEmpty'
import { buildError } from './utils'
import { errorMessages } from '../messages'
const { FILEUPLOAD } = AnswerValidationConstants

export const fileUploadValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>

  const {
    isSelfEmployed,
    applicationType,
    isRecivingUnemploymentBenefits,
    unemploymentBenefits,
    otherParent,
  } = getApplicationAnswers(application.answers)
  if (isSelfEmployed === YES && obj.selfEmployedFile) {
    if (isEmpty((obj as { selfEmployedFile: unknown[] }).selfEmployedFile))
      return buildError(
        errorMessages.requiredAttachment,
        'selfEmployedFile',
        FILEUPLOAD,
      )

    return undefined
  }

  if (applicationType === PARENTAL_GRANT_STUDENTS && obj.studentFile) {
    if (isEmpty((obj as { studentFile: unknown[] }).studentFile))
      return buildError(
        errorMessages.requiredAttachment,
        'studentFile',
        FILEUPLOAD,
      )
    return undefined
  }

  if (otherParent === SINGLE && obj.singleParent) {
    if (isEmpty((obj as { singleParent: unknown[] }).singleParent))
      return buildError(
        errorMessages.requiredAttachment,
        'singleParent',
        FILEUPLOAD,
      )

    return undefined
  }

  if (isRecivingUnemploymentBenefits) {
    if (
      (unemploymentBenefits === UnEmployedBenefitTypes.union ||
        unemploymentBenefits === UnEmployedBenefitTypes.healthInsurance) &&
      obj.benefitsFile
    ) {
      if (isEmpty((obj as { benefitsFile: unknown[] }).benefitsFile))
        return buildError(
          errorMessages.requiredAttachment,
          'benefitsFile',
          FILEUPLOAD,
        )

      return undefined
    }
  }

  return undefined
}
