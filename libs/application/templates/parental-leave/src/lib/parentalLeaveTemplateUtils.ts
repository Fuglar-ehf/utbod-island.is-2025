import { ApplicationContext } from '@island.is/application/types'

import { YES, NO } from '../constants'
import { requiresOtherParentApproval } from '../lib/parentalLeaveUtils'

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    employer: { isSelfEmployed: typeof YES | typeof NO }
  }

  return currentApplicationAnswers.employer.isSelfEmployed === NO
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
