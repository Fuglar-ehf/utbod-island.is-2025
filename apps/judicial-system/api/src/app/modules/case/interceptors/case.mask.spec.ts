import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseDecision,
  Gender,
  CaseState,
  CaseType,
  InstitutionType,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { Case } from '../models'
import { maskCaseByUser } from './case.mask'

function createCase(type: CaseType): Case {
  const baseCase: Case = {
    id: '-',
    created: '-',
    modified: '-',
    type,
    description: '-',
    state: CaseState.SUBMITTED,
    policeCaseNumber: '-',
    defendants: undefined,
    defenderName: '-',
    defenderEmail: '-',
    defenderPhoneNumber: '-',
    sendRequestToDefender: true,
    defenderIsSpokesperson: true,
    court: undefined,
    leadInvestigator: '-',
    arrestDate: '-',
    requestedCourtDate: '-',
    translator: '-',
    requestedValidToDate: '-',
    demands: '-',
    lawsBroken: '-',
    legalBasis: '-',
    legalProvisions: [],
    requestedCustodyRestrictions: [],
    requestedOtherRestrictions: '-',
    caseFacts: '-',
    legalArguments: '-',
    requestProsecutorOnlySession: true,
    prosecutorOnlySessionRequest: '-',
    comments: '-',
    caseFilesComments: '-',
    prosecutor: undefined,
    sharedWithProsecutorsOffice: undefined,
    courtCaseNumber: '-',
    sessionArrangements: SessionArrangements.ALL_PRESENT,
    courtDate: '-',
    courtLocation: '-',
    courtRoom: '-',
    courtStartDate: '-',
    courtEndTime: '-',
    isClosedCourtHidden: true,
    courtAttendees: '-',
    prosecutorDemands: '-',
    courtDocuments: [],
    accusedBookings: '-',
    litigationPresentations: '-',
    courtCaseFacts: '-',
    courtLegalArguments: '-',
    ruling: '-',
    decision: CaseDecision.DISMISSING,
    validToDate: '-',
    isValidToDateInThePast: true,
    isCustodyIsolation: true,
    isolationToDate: '-',
    conclusion: '-',
    endOfSessionBookings: '-',
    accusedAppealDecision: CaseAppealDecision.ACCEPT,
    accusedAppealAnnouncement: '-',
    prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
    prosecutorAppealAnnouncement: '-',
    accusedPostponedAppealDate: '-',
    prosecutorPostponedAppealDate: '-',
    isAppealDeadlineExpired: true,
    isAppealGracePeriodExpired: true,
    rulingDate: '-',
    initialRulingDate: '-',
    judge: undefined,
    registrar: undefined,
    courtRecordSignatory: undefined,
    courtRecordSignatureDate: '-',
    parentCase: undefined,
    childCase: undefined,
    notifications: [],
    caseFiles: [],
  }

  return {
    ...baseCase,
    defendants: [
      {
        id: '-',
        created: '-',
        modified: '-',
        caseId: '-',
        nationalId: '-',
        name: '-',
        address: '-',
        gender: Gender.FEMALE,
      },
    ],
    court: {
      id: '-',
      created: '-',
      modified: '-',
      type: InstitutionType.COURT,
      name: '-',
    },
    prosecutor: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.PROSECUTOR,
      active: true,
    },
    sharedWithProsecutorsOffice: {
      id: '-',
      created: '-',
      modified: '-',
      type: InstitutionType.PROSECUTORS_OFFICE,
      name: '-',
    },
    judge: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.JUDGE,
      active: true,
    },
    registrar: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.REGISTRAR,
      active: true,
    },
    courtRecordSignatory: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.REGISTRAR,
      active: true,
    },
    parentCase: baseCase,
    childCase: baseCase,
    isMasked: false,
  }
}

function maskedCase(theCase: Case) {
  return {
    id: theCase.id,
    created: theCase.created,
    modified: theCase.modified,
    type: theCase.type,
    state: theCase.state,
    policeCaseNumber: theCase.policeCaseNumber,
    defendants: theCase.defendants?.map((defendant) => ({
      id: defendant.id,
      created: defendant.created,
      modified: defendant.modified,
      nationalId: defendant.nationalId,
      name: defendant.name,
    })),
    defenderName: theCase.defenderName,
    defenderEmail: theCase.defenderEmail,
    defenderPhoneNumber: theCase.defenderPhoneNumber,
    defenderIsSpokesperson: theCase.defenderIsSpokesperson,
    court: theCase.court,
    requestedCourtDate: theCase.requestedCourtDate,
    courtCaseNumber: theCase.courtCaseNumber,
    sessionArrangements: theCase.sessionArrangements,
    courtDate: theCase.courtDate,
    courtRoom: theCase.courtRoom,
    courtEndTime: theCase.courtEndTime,
    decision: theCase.decision,
    validToDate: theCase.validToDate,
    isValidToDateInThePast: theCase.isValidToDateInThePast,
    creatingProsecutor: theCase.creatingProsecutor,
    prosecutor: theCase.prosecutor,
    rulingDate: theCase.rulingDate,
    initialRulingDate: theCase.initialRulingDate,
    accusedAppealDecision: theCase.accusedAppealDecision,
    prosecutorAppealDecision: theCase.prosecutorAppealDecision,
    accusedPostponedAppealDate: theCase.accusedPostponedAppealDate,
    prosecutorPostponedAppealDate: theCase.prosecutorPostponedAppealDate,
    judge: theCase.judge,
    registrar: theCase.registrar,
    courtRecordSignatory: theCase.courtRecordSignatory,
    courtRecordSignatureDate: theCase.courtRecordSignatureDate,
    parentCase: theCase.parentCase && {
      id: theCase.parentCase.id,
      created: theCase.parentCase.created,
      modified: theCase.parentCase.modified,
      type: theCase.parentCase.type,
      state: theCase.parentCase.state,
      policeCaseNumber: theCase.parentCase.policeCaseNumber,
      defenderName: theCase.parentCase.defenderName,
      defenderEmail: theCase.parentCase.defenderEmail,
      defenderPhoneNumber: theCase.parentCase.defenderPhoneNumber,
      defenderIsSpokesperson: theCase.parentCase.defenderIsSpokesperson,
      court: theCase.parentCase.court,
      requestedCourtDate: theCase.parentCase.requestedCourtDate,
      courtCaseNumber: theCase.parentCase.courtCaseNumber,
      sessionArrangements: theCase.parentCase.sessionArrangements,
      courtDate: theCase.parentCase.courtDate,
      courtRoom: theCase.parentCase.courtRoom,
      courtEndTime: theCase.parentCase.courtEndTime,
      decision: theCase.parentCase.decision,
      validToDate: theCase.parentCase.validToDate,
      isValidToDateInThePast: theCase.parentCase.isValidToDateInThePast,
      creatingProsecutor: theCase.parentCase.creatingProsecutor,
      prosecutor: theCase.parentCase.prosecutor,
      rulingDate: theCase.parentCase.rulingDate,
      initialRulingDate: theCase.parentCase.initialRulingDate,
      accusedAppealDecision: theCase.parentCase.accusedAppealDecision,
      prosecutorAppealDecision: theCase.parentCase.prosecutorAppealDecision,
      accusedPostponedAppealDate: theCase.parentCase.accusedPostponedAppealDate,
      prosecutorPostponedAppealDate:
        theCase.parentCase.prosecutorPostponedAppealDate,
      judge: theCase.parentCase.judge,
      registrar: theCase.parentCase.registrar,
      courtRecordSignatory: theCase.parentCase.courtRecordSignatory,
      courtRecordSignatureDate: theCase.parentCase.courtRecordSignatureDate,
    },
    isMasked: true,
  }
}

describe('Mask Case by User', () => {
  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
  `.describe('given a $type case', ({ type }) => {
    each`
      user
      ${{ id: '+', role: UserRole.PROSECUTOR }}
      ${{ id: '+', role: UserRole.JUDGE }}
      ${{ id: '+', role: UserRole.REGISTRAR }}
    `.it('should not mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toBe(theCase)
    })
  })

  each`
    type
    ${CaseType.SEARCH_WARRANT}
    ${CaseType.BANKING_SECRECY_WAIVER}
    ${CaseType.PHONE_TAPPING}
    ${CaseType.TELECOMMUNICATIONS}
    ${CaseType.TRACKING_EQUIPMENT}
    ${CaseType.PSYCHIATRIC_EXAMINATION}
    ${CaseType.SOUND_RECORDING_EQUIPMENT}
    ${CaseType.AUTOPSY}
    ${CaseType.BODY_SEARCH}
    ${CaseType.INTERNET_USAGE}
    ${CaseType.RESTRAINING_ORDER}
    ${CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION}
    ${CaseType.OTHER}
  `.describe('given a $type case', ({ type }) => {
    each`
      user
      ${{ id: '+', role: UserRole.PROSECUTOR }}
      ${{ id: '-', role: UserRole.JUDGE }}
      ${{ id: '-', role: UserRole.REGISTRAR }}
    `.it('should not mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toBe(theCase)
    })

    each`
      user
      ${{ id: '+', role: UserRole.JUDGE }}
      ${{ id: '+', role: UserRole.REGISTRAR }}
    `.it('should mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toStrictEqual(maskedCase(theCase))
    })

    it('should mask cases without a judge for judges', () => {
      const theCase = { ...createCase(type), judge: undefined }
      const judge = { id: '+', role: UserRole.JUDGE } as User

      const res = maskCaseByUser(theCase, judge)

      expect(res).toStrictEqual(maskedCase(theCase))
    })

    it('should mask cases without a registrar for registrars', () => {
      const theCase = { ...createCase(type), registrar: undefined }
      const registrar = { id: '+', role: UserRole.REGISTRAR } as User

      const res = maskCaseByUser(theCase, registrar)

      expect(res).toStrictEqual(maskedCase(theCase))
    })
  })
})
