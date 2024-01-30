import { ApplicationContext } from '@island.is/application/types'

import {
  YES,
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  States,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  requiresOtherParentApproval,
} from '../lib/parentalLeaveUtils'
import { EmployerRow } from '../types'
import { getValueViaPath } from '@island.is/application/core'
import { disableResidenceGrantApplication } from './answerValidationSections/utils'

export function allEmployersHaveApproved(context: ApplicationContext) {
  const employers = getValueViaPath<EmployerRow[]>(
    context.application.answers,
    'employers',
  )
  if (!employers) {
    return false
  }
  return employers.every((e) => !!e.isApproved)
}

export function hasEmployer(context: ApplicationContext) {
  const { application } = context
  const { isReceivingUnemploymentBenefits, isSelfEmployed, employers } =
    getApplicationAnswers(application.answers)

  const applicationType = (
    application.answers as {
      applicationType: { option: string }
    }
  )?.applicationType

  // Added this check for applications that is in the db already so they can go through to next state
  if (applicationType === undefined) {
    if (isReceivingUnemploymentBenefits !== undefined) {
      return isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO
    }
    return isSelfEmployed === NO
  } else {
    if (applicationType.option === PARENTAL_LEAVE) {
      return isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO
    } else if (
      (applicationType.option === PARENTAL_GRANT ||
        applicationType.option === PARENTAL_GRANT_STUDENTS) &&
      employers !== undefined
    ) {
      return employers.some((employer) => employer.stillEmployed === YES)
    } else {
      return false
    }
  }
}

export function needsOtherParentApproval(context: ApplicationContext) {
  return requiresOtherParentApproval(
    context.application.answers,
    context.application.externalData,
  )
}

export function currentDateStartTime() {
  const date = new Date().toDateString()
  return new Date(date).getTime()
}

export function findActionName(context: ApplicationContext) {
  const { application } = context
  const { state } = application
  const { addEmployer, addPeriods } = getApplicationAnswers(application.answers)
  if (
    state === States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE ||
    state === States.RESIDENCE_GRAND_APPLICATION
  )
    return 'documentPeriod'
  if (state === States.ADDITIONAL_DOCUMENTS_REQUIRED) return 'document'
  if (state === States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS) {
    if (addEmployer === YES && addPeriods === YES) return 'empper'
    if (addEmployer === YES) return 'employer'
    if (addPeriods === YES) return 'period'
  }

  return undefined
}

export function hasDateOfBirth(context: ApplicationContext) {
  const { application } = context
  const { dateOfBirth } = getApplicationExternalData(application.externalData)
  return disableResidenceGrantApplication(dateOfBirth?.data?.dateOfBirth || '')
}

export function goToState(
  applicationContext: ApplicationContext,
  state: States,
) {
  const { previousState } = getApplicationAnswers(
    applicationContext.application.answers,
  )
  if (previousState === state) return true
  return false
}
