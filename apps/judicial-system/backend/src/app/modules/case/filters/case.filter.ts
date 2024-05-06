import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isInvestigationCase,
  isPrisonSystemUser,
  isProsecutionUser,
  isRestrictionCase,
  RequestSharedWithDefender,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { DateLog } from '../models/dateLog.model'

const canProsecutionUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean => {
  // Check case type access
  if (user.role !== UserRole.PROSECUTOR && !isIndictmentCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    ![
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.WAITING_FOR_CONFIRMATION,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
      CaseState.MAIN_HEARING,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check prosecutors office access
  if (
    user.institution?.id !== theCase.prosecutorsOfficeId &&
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

const canDistrictCourtUserAccessCase = (theCase: Case, user: User): boolean => {
  // Check case type access
  if (
    ![
      UserRole.DISTRICT_COURT_JUDGE,
      UserRole.DISTRICT_COURT_REGISTRAR,
    ].includes(user.role)
  ) {
    if (!isIndictmentCase(theCase.type)) {
      return false
    }
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
      CaseState.MAIN_HEARING,
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

const canAppealsCourtUserAccessCase = (theCase: Case): boolean => {
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
    ![
      CaseAppealState.RECEIVED,
      CaseAppealState.COMPLETED,
      CaseAppealState.WITHDRAWN,
    ].includes(theCase.appealState)
  ) {
    return false
  }

  if (
    theCase.appealState === CaseAppealState.WITHDRAWN &&
    !theCase.appealReceivedByCourtDate
  ) {
    return false
  }

  return true
}

const canPrisonSystemUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean => {
  // Prison system users cannot update cases
  if (forUpdate) {
    return false
  }

  // Check case type access
  if (user.institution?.type === InstitutionType.PRISON_ADMIN) {
    if (
      !isRestrictionCase(theCase.type) &&
      theCase.type !== CaseType.PAROLE_REVOCATION
    ) {
      return false
    }
  } else if (
    ![
      CaseType.CUSTODY,
      CaseType.ADMISSION_TO_FACILITY,
      CaseType.PAROLE_REVOCATION,
    ].includes(theCase.type)
  ) {
    return false
  }

  // Check case state access
  if (theCase.state !== CaseState.ACCEPTED) {
    return false
  }

  // Check prison access to alternative travel ban
  if (user.institution?.type === InstitutionType.PRISON_ADMIN) {
    if (
      !theCase.decision ||
      ![
        CaseDecision.ACCEPTING,
        CaseDecision.ACCEPTING_PARTIALLY,
        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      ].includes(theCase.decision)
    ) {
      return false
    }
  } else {
    if (
      !theCase.decision ||
      ![CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY].includes(
        theCase.decision,
      )
    ) {
      return false
    }
  }

  return true
}

const canDefenceUserAccessCase = (theCase: Case, user: User): boolean => {
  // Check case state access
  if (
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

  // Check submitted case access
  const canDefenderAccessSubmittedCase =
    (isRestrictionCase(theCase.type) || isInvestigationCase(theCase.type)) &&
    theCase.requestSharedWithDefender ===
      RequestSharedWithDefender.READY_FOR_COURT

  if (
    theCase.state === CaseState.SUBMITTED &&
    !canDefenderAccessSubmittedCase
  ) {
    return false
  }

  // Check received case access
  if (theCase.state === CaseState.RECEIVED) {
    const canDefenderAccessReceivedCase =
      isIndictmentCase(theCase.type) ||
      canDefenderAccessSubmittedCase ||
      Boolean(DateLog.arraignmentDate(theCase.dateLogs))

    if (!canDefenderAccessReceivedCase) {
      return false
    }
  }

  // Check case defender access
  if (isIndictmentCase(theCase.type)) {
    if (
      !theCase.defendants?.some(
        (defendant) => defendant.defenderNationalId === user.nationalId,
      )
    ) {
      return false
    }
  } else {
    if (theCase.defenderNationalId !== user.nationalId) {
      return false
    }
  }

  return true
}

export const canUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean => {
  if (isProsecutionUser(user)) {
    return canProsecutionUserAccessCase(theCase, user, forUpdate)
  }

  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserAccessCase(theCase, user)
  }

  if (isCourtOfAppealsUser(user)) {
    return canAppealsCourtUserAccessCase(theCase)
  }

  if (isPrisonSystemUser(user)) {
    return canPrisonSystemUserAccessCase(theCase, user, forUpdate)
  }

  if (isDefenceUser(user)) {
    return canDefenceUserAccessCase(theCase, user)
  }

  // Other users cannot access cases
  return false
}
