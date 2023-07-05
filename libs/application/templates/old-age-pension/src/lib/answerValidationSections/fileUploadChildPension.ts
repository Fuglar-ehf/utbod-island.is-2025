import { Application, Answer } from '@island.is/application/types'

import isEmpty from 'lodash/isEmpty'

import { validatorErrorMessages } from '../messages'
import {
  childCustody_LivesWithApplicant,
  getApplicationAnswers,
  getApplicationExternalData,
} from '../oldAgePensionUtils'
import {
  AnswerValidationConstants,
  HomeAllowanceHousing,
  YES,
} from '../constants'
import { buildError } from './utils'

export const fileUploadChildPension = (
  newAnswer: unknown,
  application: Application,
) => {
  const obj = newAnswer as Record<string, Answer>
  const { FILEUPLOADCHILDPENSION } = AnswerValidationConstants

  const { childPension } = getApplicationAnswers(application.answers)

  const DoesNotLiveWithApplicant = childCustody_LivesWithApplicant(
    application.externalData,
  )

  if (childPension.length > 0 && obj.maintenance) {
    if (isEmpty((obj as { maintenance: unknown[] }).maintenance)) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADCHILDPENSION}.maintenance`,
      )
    }
  }

  if (DoesNotLiveWithApplicant && obj.notLivesWithApplicant) {
    if (
      isEmpty(
        (obj as { notLivesWithApplicant: unknown[] }).notLivesWithApplicant,
      )
    ) {
      return buildError(
        validatorErrorMessages.requireAttachment,
        `${FILEUPLOADCHILDPENSION}.notLivesWithApplicant`,
      )
    }
  }

  return undefined
}
