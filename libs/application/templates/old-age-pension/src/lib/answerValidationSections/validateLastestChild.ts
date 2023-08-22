import { Application } from '@island.is/application/types'
import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants } from '../constants'
import { buildError } from './utils'
import { ChildPensionRow } from '../../types'
import * as kennitala from 'kennitala'
import subYears from 'date-fns/subYears'
import startOfYear from 'date-fns/startOfYear'
import { getApplicationExternalData } from '../oldAgePensionUtils'

export const validateLastestChild = (
  newAnswer: unknown,
  application: Application,
) => {
  const rawChildPensionRow = newAnswer as ChildPensionRow[] | undefined
  const { VALIDATE_LATEST_CHILD } = AnswerValidationConstants

  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )

  if (!Array.isArray(rawChildPensionRow)) {
    return buildError(
      validatorErrorMessages.childPensionNotAList,
      `${VALIDATE_LATEST_CHILD}`,
    )
  }

  const i = rawChildPensionRow.length - 1
  if (i < 0) {
    return undefined
  }
  const child = rawChildPensionRow[i]

  if (child.childDoesNotHaveNationalId) {
    if (!child.nationalIdOrBirthDate) {
      return buildError(
        validatorErrorMessages.childBirthDate,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }

    const finalMinDate = startOfYear(subYears(new Date(), 17))
    const selectedDate = new Date(child.nationalIdOrBirthDate)
    if (!(finalMinDate <= selectedDate)) {
      return buildError(
        validatorErrorMessages.childPensionChildMustBeUnder18,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (!child.name) {
      return buildError(
        validatorErrorMessages.childName,
        `${VALIDATE_LATEST_CHILD}[${i}].name`,
      )
    }
  } else {
    if (!child.nationalIdOrBirthDate) {
      return buildError(
        validatorErrorMessages.childNationalId,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      rawChildPensionRow.findIndex(
        (item) => item.nationalIdOrBirthDate === child.nationalIdOrBirthDate,
      ) !== i
    ) {
      return buildError(
        validatorErrorMessages.childNationalIdDuplicate,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      custodyInformation.findIndex(
        (item) =>
          kennitala.format(item.nationalId) === child.nationalIdOrBirthDate,
      ) !== -1
    ) {
      return buildError(
        validatorErrorMessages.childNationalIdDuplicate,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      child.nationalIdOrBirthDate.length !== 0 &&
      kennitala.isValid(child.nationalIdOrBirthDate) &&
      kennitala.isPerson(child.nationalIdOrBirthDate)
    ) {
      if (kennitala.info(child.nationalIdOrBirthDate).age >= 18) {
        return buildError(
          validatorErrorMessages.childPensionChildMustBeUnder18,
          `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
        )
      }
    } else {
      return buildError(
        validatorErrorMessages.childNationalIdMustBeValid,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
  }

  return undefined
}
