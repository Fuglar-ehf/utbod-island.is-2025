import { Application, Answer } from '@island.is/application/types'

import { validatorErrorMessages } from './../messages'
import { getStartDateAndEndDate } from './../oldAgePensionUtils'
import { AnswerValidationConstants, MONTHS } from './../constants'
import { buildError } from './utils'

export const period = (newAnswer: unknown, application: Application) => {
  const obj = newAnswer as Record<string, Answer>
  const { PERIOD } = AnswerValidationConstants

  const { startDate, endDate } = getStartDateAndEndDate(application.applicant)
  const { year, month } = obj

  if (!startDate) {
    return buildError(
      validatorErrorMessages.periodStartDateNeeded,
      `${PERIOD}.year`,
    )
  }

  if (!endDate) {
    return buildError(
      validatorErrorMessages.periodEndDateNeeded,
      `${PERIOD}.year`,
    )
  }

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  if (startDateYear > +year || endDateYear < +year) {
    return buildError(validatorErrorMessages.periodYear, `${PERIOD}.year`)
  }

  const newStartDate = new Date(startDate.getFullYear(), startDate.getMonth())
  const newEndDate = new Date(endDate.getFullYear(), endDate.getMonth())
  const selectedDate = new Date(
    +year,
    MONTHS.findIndex((e) => e === month),
  )

  if (newStartDate > selectedDate || newEndDate < selectedDate) {
    return buildError(validatorErrorMessages.periodMonth, `${PERIOD}.month`)
  }

  return undefined
}
