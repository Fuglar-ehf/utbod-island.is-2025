import {
  CaseDecision,
  CaseState,
  CaseType,
  indictmentCases,
  InstitutionType,
  isIndictmentCase,
  UserRole,
  isProsecutionUser,
  isDistrictCourtUser,
  isAppealsCourtUser,
  isPrisonSystemUser,
  isRestrictionCase,
  isInvestigationCase,
  CaseAppealState,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

function canProsecutionUserAccessCase(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  // Check case type access
  if (user.role === UserRole.PROSECUTOR) {
    if (
      !isRestrictionCase(theCase.type) &&
      !isInvestigationCase(theCase.type) &&
      !isIndictmentCase(theCase.type)
    ) {
      return false
    }
  } else if (!isIndictmentCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    ![
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check prosecutors office access
  if (
    theCase.creatingProsecutor?.institutionId &&
    user.institution?.id !== theCase.creatingProsecutor?.institutionId &&
    (forUpdate ||
      user.institution?.id !== theCase.sharedWithProsecutorsOfficeId)
  ) {
    return false
  }

  // Check heightened security level access
  if (
    theCase.isHeightenedSecurityLevel &&
    user.id !== theCase.creatingProsecutorId &&
    user.id !== theCase.prosecutorId
  ) {
    return false
  }

  return true
}

function canDistrictCourtUserAccessCase(theCase: Case, user: User): boolean {
  // Check case type access
  if ([UserRole.JUDGE, UserRole.REGISTRAR].includes(user.role)) {
    if (
      !isRestrictionCase(theCase.type) &&
      !isInvestigationCase(theCase.type) &&
      !isIndictmentCase(theCase.type)
    ) {
      return false
    }
  } else if (!indictmentCases.includes(theCase.type)) {
    return false
  }

  // Check case state access
  if (isRestrictionCase(theCase.type) || isInvestigationCase(theCase.type)) {
    if (
      ![
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ].includes(theCase.state)
    ) {
      return false
    }
  } else if (
    ![
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check court access
  if (user.institution?.id !== theCase.courtId) {
    return false
  }

  return true
}

function canAppealsCourtUserAccessCase(theCase: Case): boolean {
  // Check case type access
  if (!isRestrictionCase(theCase.type) && !isInvestigationCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    ![CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED].includes(
      theCase.state,
    )
  ) {
    return false
  }

  // Check appeal state access
  if (
    !theCase.appealState ||
    ![CaseAppealState.RECEIVED, CaseAppealState.COMPLETED].includes(
      theCase.appealState,
    )
  ) {
    return false
  }

  return true
}

function canPrisonSystemUserAccessCase(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  // Prison system users cannot update cases
  if (forUpdate) {
    return false
  }

  // Check case type access
  if (user.institution?.type === InstitutionType.PRISON_ADMIN) {
    if (!isRestrictionCase(theCase.type)) {
      return false
    }
  } else if (
    ![CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY].includes(theCase.type)
  ) {
    return false
  }

  // Check case state access
  if (
    theCase.state !== CaseState.ACCEPTED ||
    (user.institution?.type !== InstitutionType.PRISON_ADMIN &&
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
  ) {
    return false
  }

  return true
}

export function canUserAccessCase(
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean {
  if (isProsecutionUser(user)) {
    return canProsecutionUserAccessCase(theCase, user, forUpdate)
  }

  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserAccessCase(theCase, user)
  }

  if (isAppealsCourtUser(user)) {
    return canAppealsCourtUserAccessCase(theCase)
  }

  if (isPrisonSystemUser(user)) {
    return canPrisonSystemUserAccessCase(theCase, user, forUpdate)
  }

  // Other users cannot access cases
  return false
}
