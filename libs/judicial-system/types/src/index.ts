export { Feature } from './lib/feature'

export {
  Gender,
  DefenderChoice,
  SubpoenaType,
  DefendantPlea,
  ServiceRequirement,
  ServiceStatus,
  isSuccessfulServiceStatus,
  isFailedServiceStatus,
} from './lib/defendant'
export { InstitutionType } from './lib/institution'
export {
  CaseNotificationType,
  SubpoenaNotificationType,
  NotificationType,
  InstitutionNotificationType,
  NotificationDispatchType,
  DefendantNotificationType,
  CivilClaimantNotificationType,
  IndictmentCaseNotificationType,
  EventNotificationType,
  notificationTypes,
} from './lib/notification'
export type { Institution } from './lib/institution'
export {
  EventType,
  eventTypes,
  DefendantEventType,
  defendantEventTypes,
} from './lib/eventLog'
export { DateType, dateTypes } from './lib/dateLog'
export { StringType, stringTypes } from './lib/caseString'

export { CaseFileState, CaseFileCategory } from './lib/file'

export {
  UserRole,
  prosecutionRoles,
  isProsecutionUser,
  publicProsecutorRoles,
  isPublicProsecutorUser,
  districtCourtRoles,
  isDistrictCourtUser,
  courtOfAppealsRoles,
  isCourtOfAppealsUser,
  prisonSystemRoles,
  isPrisonSystemUser,
  isPrisonStaffUser,
  defenceRoles,
  isDefenceUser,
  isAdminUser,
  isCoreUser,
  isPrisonAdminUser,
  isPublicProsecutor,
} from './lib/user'
export type { User } from './lib/user'

export {
  CaseOrigin,
  CaseType,
  IndictmentSubtype,
  CaseState,
  IndictmentCaseState,
  CaseAppealState,
  RequestCaseState,
  CaseTransition,
  IndictmentCaseTransition,
  RequestCaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseDecision,
  CaseAppealRulingDecision,
  CaseIndictmentRulingDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  indictmentCases,
  restrictionCases,
  investigationCases,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  isIndictmentCase,
  isRestrictionCase,
  isInvestigationCase,
  isRequestCase,
  isAcceptingCaseDecision,
  isTrafficViolationCase,
  completedRequestCaseStates,
  completedIndictmentCaseStates,
  completedCaseStates,
  isCompletedCase,
  hasIndictmentCaseBeenSubmittedToCourt,
  getStatementDeadline,
  isIndictmentCaseState,
  isRequestCaseState,
  isIndictmentCaseTransition,
  isRequestCaseTransition,
  CourtSessionType,
  courtSessionTypeNames,
} from './lib/case'

export {
  getIndictmentVerdictAppealDeadlineStatus,
  VERDICT_APPEAL_WINDOW_DAYS,
  FINE_APPEAL_WINDOW_DAYS,
} from './lib/indictmentCase'

export type {
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from './lib/case'

export {
  IndictmentCountOffense,
  Substance,
  offenseSubstances,
} from './lib/indictmentCount'

export { type Lawyer, mapToLawyer, AdvocateType } from './lib/advocate'

export type { SubstanceMap } from './lib/indictmentCount'

export type { CourtDocument } from './lib/courtDocument'
