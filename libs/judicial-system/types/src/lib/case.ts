import flatten from 'lodash/flatten'

export enum CaseOrigin {
  UNKNOWN = 'UNKNOWN',
  RVG = 'RVG',
  LOKE = 'LOKE',
}

export enum CaseType {
  // Indictment cases
  INDICTMENT = 'INDICTMENT',
  // Restriction Cases
  ADMISSION_TO_FACILITY = 'ADMISSION_TO_FACILITY',
  CUSTODY = 'CUSTODY',
  TRAVEL_BAN = 'TRAVEL_BAN',
  // Investigation Cases
  AUTOPSY = 'AUTOPSY',
  BANKING_SECRECY_WAIVER = 'BANKING_SECRECY_WAIVER',
  BODY_SEARCH = 'BODY_SEARCH',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION = 'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
  EXPULSION_FROM_HOME = 'EXPULSION_FROM_HOME',
  INTERNET_USAGE = 'INTERNET_USAGE',
  OTHER = 'OTHER',
  PHONE_TAPPING = 'PHONE_TAPPING',
  PAROLE_REVOCATION = 'PAROLE_REVOCATION',
  PSYCHIATRIC_EXAMINATION = 'PSYCHIATRIC_EXAMINATION',
  RESTRAINING_ORDER = 'RESTRAINING_ORDER',
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME = 'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME',
  SEARCH_WARRANT = 'SEARCH_WARRANT',
  SOUND_RECORDING_EQUIPMENT = 'SOUND_RECORDING_EQUIPMENT',
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS',
  TRACKING_EQUIPMENT = 'TRACKING_EQUIPMENT',
  VIDEO_RECORDING_EQUIPMENT = 'VIDEO_RECORDING_EQUIPMENT',
}

export enum IndictmentSubtype {
  AGGRAVATED_ASSAULT = 'AGGRAVATED_ASSAULT',
  ALCOHOL_LAWS = 'ALCOHOL_LAWS',
  ANIMAL_PROTECTION = 'ANIMAL_PROTECTION',
  ASSAULT_LEADING_TO_DEATH = 'ASSAULT_LEADING_TO_DEATH',
  ATTEMPTED_MURDER = 'ATTEMPTED_MURDER',
  BODILY_INJURY = 'BODILY_INJURY',
  BREAKING_AND_ENTERING = 'BREAKING_AND_ENTERING',
  CHILD_PROTECTION_LAWS = 'CHILD_PROTECTION_LAWS',
  COVER_UP = 'COVER_UP',
  CUSTOMS_VIOLATION = 'CUSTOMS_VIOLATION',
  DOMESTIC_VIOLENCE = 'DOMESTIC_VIOLENCE',
  EMBEZZLEMENT = 'EMBEZZLEMENT',
  FOREIGN_NATIONALS = 'FOREIGN_NATIONALS',
  FRAUD = 'FRAUD',
  INDECENT_EXPOSURE = 'INDECENT_EXPOSURE',
  INTIMATE_RELATIONS = 'INTIMATE_RELATIONS',
  LEGAL_ENFORCEMENT_LAWS = 'LEGAL_ENFORCEMENT_LAWS',
  LOOTING = 'LOOTING',
  MAJOR_ASSAULT = 'MAJOR_ASSAULT',
  MEDICINES_OFFENSE = 'MEDICINES_OFFENSE',
  MINOR_ASSAULT = 'MINOR_ASSAULT',
  MONEY_LAUNDERING = 'MONEY_LAUNDERING',
  MURDER = 'MURDER',
  NARCOTICS_OFFENSE = 'NARCOTICS_OFFENSE',
  NAVAL_LAW_VIOLATION = 'NAVAL_LAW_VIOLATION',
  OTHER_CRIMINAL_OFFENSES = 'OTHER_CRIMINAL_OFFENSES',
  OTHER_OFFENSES = 'OTHER_OFFENSES',
  POLICE_REGULATIONS = 'POLICE_REGULATIONS',
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE',
  PUBLIC_SERVICE_VIOLATION = 'PUBLIC_SERVICE_VIOLATION',
  RAPE = 'RAPE',
  SEXUAL_OFFENSES_OTHER_THAN_RAPE = 'SEXUAL_OFFENSES_OTHER_THAN_RAPE',
  TAX_VIOLATION = 'TAX_VIOLATION',
  THEFT = 'THEFT',
  THREAT = 'THREAT',
  TRAFFIC_VIOLATION = 'TRAFFIC_VIOLATION',
  UTILITY_THEFT = 'UTILITY_THEFT',
  WEPONS_VIOLATION = 'WEPONS_VIOLATION',
}

export interface IndictmentSubtypeMap {
  [key: string]: IndictmentSubtype[]
}

export interface CrimeScene {
  place?: string
  date?: Date
}

export interface CrimeSceneMap {
  [key: string]: CrimeScene
}

export enum CaseState {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION',
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  DISMISSED = 'DISMISSED',
}

export enum CaseAppealState {
  APPEALED = 'APPEALED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum CaseTransition {
  OPEN = 'OPEN',
  ASK_FOR_CONFIRMATION = 'ASK_FOR_CONFIRMATION',
  SUBMIT = 'SUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
  DISMISS = 'DISMISS',
  REOPEN = 'REOPEN',
  APPEAL = 'APPEAL',
  RECEIVE_APPEAL = 'RECEIVE_APPEAL',
  COMPLETE_APPEAL = 'COMPLETE_APPEAL',
  REOPEN_APPEAL = 'REOPEN_APPEAL',
  WITHDRAW_APPEAL = 'WITHDRAW_APPEAL',
  DENY_INDICTMENT = 'DENY_INDICTMENT',
  RETURN_INDICTMENT = 'RETURN_INDICTMENT',
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum CaseLegalProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // 2. mgr. 95. gr.
  _97_1 = '_97_1', // 1. mgr. 97. gr. sml.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
  _100_1 = '_100_1', // 1. mgr. 100. gr. sml.
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum CaseCustodyRestrictions {
  NECESSITIES = 'NECESSITIES',
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
  ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION = 'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
  WORKBAN = 'WORKBAN',
}

export enum CaseAppealDecision {
  APPEAL = 'APPEAL',
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum CaseDecision {
  ACCEPTING = 'ACCEPTING',
  REJECTING = 'REJECTING',
  ACCEPTING_ALTERNATIVE_TRAVEL_BAN = 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
  ACCEPTING_PARTIALLY = 'ACCEPTING_PARTIALLY',
  DISMISSING = 'DISMISSING',
}

export enum CaseAppealRulingDecision {
  ACCEPTING = 'ACCEPTING',
  REPEAL = 'REPEAL',
  CHANGED = 'CHANGED',
  CHANGED_SIGNIFICANTLY = 'CHANGED_SIGNIFICANTLY',
  DISMISSED_FROM_COURT_OF_APPEAL = 'DISMISSED_FROM_COURT_OF_APPEAL',
  DISMISSED_FROM_COURT = 'DISMISSED_FROM_COURT',
  REMAND = 'REMAND',
  DISCONTINUED = 'DISCONTINUED',
}

export enum SessionArrangements {
  ALL_PRESENT = 'ALL_PRESENT',
  ALL_PRESENT_SPOKESPERSON = 'ALL_PRESENT_SPOKESPERSON',
  PROSECUTOR_PRESENT = 'PROSECUTOR_PRESENT',
  NONE_PRESENT = 'NONE_PRESENT',
}

export enum RequestSharedWithDefender {
  READY_FOR_COURT = 'READY_FOR_COURT',
  COURT_DATE = 'COURT_DATE', // TODO: Rename to ARRAIGNMENT_DATE at some point
  NOT_SHARED = 'NOT_SHARED',
}

export enum DefendantPlea {
  GUILTY = 'GUILTY',
  NOT_GUILTY = 'NOT_GUILTY',
  NO_PLEA = 'NO_PLEA',
}

export const indictmentCases = [CaseType.INDICTMENT]

export const isIndictmentCase = (type?: string | null): boolean => {
  return Boolean(type) && indictmentCases.includes(type as CaseType)
}

export const restrictionCases = [
  CaseType.ADMISSION_TO_FACILITY,
  CaseType.CUSTODY,
  CaseType.TRAVEL_BAN,
]

export const isRestrictionCase = (type?: CaseType | null): boolean => {
  return Boolean(type && restrictionCases.includes(type))
}

export const investigationCases = [
  CaseType.AUTOPSY,
  CaseType.BANKING_SECRECY_WAIVER,
  CaseType.BODY_SEARCH,
  CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
  CaseType.EXPULSION_FROM_HOME,
  CaseType.INTERNET_USAGE,
  CaseType.OTHER,
  CaseType.PHONE_TAPPING,
  CaseType.PAROLE_REVOCATION,
  CaseType.PSYCHIATRIC_EXAMINATION,
  CaseType.RESTRAINING_ORDER,
  CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
  CaseType.SEARCH_WARRANT,
  CaseType.SOUND_RECORDING_EQUIPMENT,
  CaseType.TELECOMMUNICATIONS,
  CaseType.TRACKING_EQUIPMENT,
  CaseType.VIDEO_RECORDING_EQUIPMENT,
]

export const isInvestigationCase = (type?: CaseType | null): boolean => {
  return Boolean(type && investigationCases.includes(type))
}

export const acceptedCaseDecisions = [
  CaseDecision.ACCEPTING,
  CaseDecision.ACCEPTING_PARTIALLY,
]

export const isAcceptingCaseDecision = (
  decision?: CaseDecision | null,
): boolean => {
  return Boolean(decision && acceptedCaseDecisions.includes(decision))
}

export const completedCaseStates = [
  CaseState.ACCEPTED,
  CaseState.REJECTED,
  CaseState.DISMISSED,
]

export const isCompletedCase = (state?: CaseState | null): boolean => {
  return Boolean(state && completedCaseStates.includes(state))
}

export const isTrafficViolationCase = (
  indictmentSubtypes?: IndictmentSubtypeMap,
  type?: CaseType,
): boolean => {
  if (!indictmentSubtypes || type !== CaseType.INDICTMENT) {
    return false
  }

  const flatIndictmentSubtypes = flatten(Object.values(indictmentSubtypes))

  return Boolean(
    flatIndictmentSubtypes.length > 0 &&
      flatIndictmentSubtypes.every(
        (val) => val === IndictmentSubtype.TRAFFIC_VIOLATION,
      ),
  )
}

export const getStatementDeadline = (appealReceived: Date): string => {
  return new Date(
    new Date(appealReceived).setDate(appealReceived.getDate() + 1),
  ).toISOString()
}

export const prosecutorCanSelectDefenderForInvestigationCase = (
  type?: CaseType | null,
): boolean => {
  return Boolean(
    type &&
      [
        CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
        CaseType.EXPULSION_FROM_HOME,
        CaseType.PAROLE_REVOCATION,
        CaseType.PSYCHIATRIC_EXAMINATION,
        CaseType.RESTRAINING_ORDER,
        CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
        CaseType.OTHER,
      ].includes(type),
  )
}

export type IndictmentConfirmation =
  | { actor: string; institution: string; date: Date }
  | undefined
