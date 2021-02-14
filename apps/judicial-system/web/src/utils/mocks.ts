import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseState,
  CaseType,
  UpdateCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import { CurrentUserQuery } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'

export const mockProsecutor = {
  role: UserRole.PROSECUTOR,
  name: 'Batman Robinson',
  title: 'saksóknari',
  institution: 'Lögreglustjórinn á höfuðborgarsvæðinu',
} as User

export const mockJudge = {
  id: 'judge_1',
  role: UserRole.JUDGE,
  name: 'Wonder Woman',
  title: 'héraðsdómari',
  institution: 'Héraðsdómur Reykjavíkur',
} as User

export const mockRegistrar = {
  id: 'registrar_1',
  role: UserRole.REGISTRAR,
  name: 'Alfred Thaddeus Crane Pennyworth',
  title: 'dómritari',
} as User

export const mockAdmin = {
  role: UserRole.ADMIN,
  name: 'Adrian Administrator',
} as User

const testCase1 = {
  id: 'test_id',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.ACCEPTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-16T19:51:00.000Z',
  requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
  lawsBroken: 'string',
  custodyProvisions: [
    CaseCustodyProvisions._95_1_A,
    CaseCustodyProvisions._95_1_C,
  ],
  requestedCustodyRestrictions: ['ISOLATION', 'MEDIA'],
  caseFacts: 'string',
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: 'string',
  comments: 'string',
  prosecutor: null,
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Prioris generis est docilitas, memoria; Quod quidem nobis non saepe contingit. Quae qui non vident, nihil umquam magnum ac cognitione dignum amaverunt. Quasi vero, inquit, perpetua oratio rhetorum solum, non etiam philosophorum sit. Duo Reges: constructio interrete. Non est ista, inquam, Piso, magna dissensio. Quantum Aristoxeni ingenium consumptum videmus in musicis? ',
  decision: CaseDecision.ACCEPTING,
  custodyEndDate: '2020-09-16T19:50:08.033Z',
  custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
  accusedAppealDecision: CaseAppealDecision.APPEAL,
  accusedAppealAnnouncement: 'accusedAppealAnnouncement test',
  prosecutorAppealDecision: CaseAppealDecision.APPEAL,
  prosecutorAppealAnnouncement: 'prosecutorAppealAnnouncement test',
  judge: null,
}

const testCase2 = {
  id: 'test_id_2',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.REJECTED,
  policeCaseNumber: '000-0000-0000',
  accusedNationalId: '000000-0000',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-12T14:51:00.000Z',
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: CaseDecision.REJECTING,
  custodyEndDate: '2020-10-24',
  custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
}

const testCase3 = {
  id: 'test_id_3',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.DRAFT,
  policeCaseNumber: '010-0000-0191',
  accusedNationalId: '1111110000',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: null,
  requestedCourtDate: null,
  requestedCustodyEndDate: null,
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [CaseCustodyRestrictions.MEDIA],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: null,
  courtCaseNumber: null,
  courtDate: '2020-09-16T19:51:28.224Z',
  courtStartTime: null,
  courtEndTime: '2020-09-16T19:51:00.000Z',
  courtAttendees: null,
  courtRoom: '999',
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: null,
  custodyEndDate: '2020-10-24',
  custodyRestrictions: null,
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  defenderName: '',
  defenderEmail: '',
}

const testCase4 = {
  id: 'test_id_4',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.REJECTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: null,
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: '2020-09-16T19:51:28.224Z',
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: CaseDecision.REJECTING,
  custodyEndDate: '2020-10-24',
  custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
}

const testCase5 = {
  id: 'test_id_5',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.ACCEPTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-12T14:51:00.000Z',
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: '2020-09-16',
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: CaseDecision.ACCEPTING,
  custodyEndDate: '2020-09-25T19:50:08.033Z',
  custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: mockJudge,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
}

const testCase6 = {
  id: 'test_id_6',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.ACCEPTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: null,
  requestedCourtDate: null,
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: '2020-09-16T19:51:28.224Z',
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: CaseDecision.ACCEPTING,
  custodyEndDate: '2020-09-24T19:50:08.033Z',
  custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  isCustodyEndDateInThePast: true,
  judge: null,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
}

const testCase7 = {
  id: 'test_id_7',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.ACCEPTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-12T14:51:00.000Z',
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: '2020-09-16',
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
  custodyEndDate: '2020-09-25T19:50:08.033Z',
  custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
}

const testCase8 = {
  id: 'test_id_8',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  type: CaseType.CUSTODY,
  state: CaseState.ACCEPTED,
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  accusedGender: CaseGender.MALE,
  court: 'string',
  arrestDate: null,
  requestedCourtDate: null,
  requestedCustodyEndDate: '2020-09-16',
  lawsBroken: null,
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: null,
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: null,
  comments: 'string',
  prosecutor: {
    name: 'Ruth Bader Ginsburg',
    title: 'saksóknari',
  },
  courtCaseNumber: null,
  courtDate: null,
  courtStartTime: null,
  courtEndTime: '2020-09-16T19:51:28.224Z',
  courtAttendees: null,
  policeDemands: null,
  accusedPleaAnnouncement: null,
  litigationPresentations: null,
  ruling: null,
  decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
  custodyEndDate: '2020-09-24T19:50:08.033Z',
  custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  isCustodyEndDateInThePast: true,
  judge: null,
  defenderName: 'Saul Goodman',
  defenderEmail: 'saul@goodman.com',
  parentCase: {
    custodyEndDate: '2021-01-18T19:50:08.033Z',
  },
}

export const mockJudgeQuery = [
  {
    request: {
      query: CurrentUserQuery,
    },
    result: {
      data: {
        currentUser: mockJudge,
      },
    },
  },
]

export const mockProsecutorQuery = [
  {
    request: {
      query: CurrentUserQuery,
    },
    result: {
      data: {
        currentUser: mockProsecutor,
      },
    },
  },
]

export const mockAdminQuery = [
  {
    request: {
      query: CurrentUserQuery,
    },
    result: {
      data: {
        currentUser: mockAdmin,
      },
    },
  },
]

export const mockUsersQuery = [
  {
    request: {
      query: UsersQuery,
    },
    result: {
      data: {
        users: [mockProsecutor, mockJudge, mockRegistrar],
      },
    },
  },
]

export const mockCaseQueries = [
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id' } },
    },
    result: {
      data: {
        case: testCase1,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_2' } },
    },
    result: {
      data: {
        case: testCase2,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_3' } },
    },
    result: {
      data: {
        case: testCase3,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_4' } },
    },
    result: {
      data: {
        case: testCase4,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_5' } },
    },
    result: {
      data: {
        case: testCase5,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_6' } },
    },
    result: {
      data: {
        case: testCase6,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_7' } },
    },
    result: {
      data: {
        case: testCase7,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_8' } },
    },
    result: {
      data: {
        case: testCase8,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: undefined } },
    },
    result: {
      error: {},
    },
  },
]

export const mockUpdateCaseMutation = (updateCases: UpdateCase[]) =>
  updateCases.map((updateCase) => {
    return {
      request: {
        query: UpdateCaseMutation,
        variables: { input: { id: 'test_id_2', ...updateCase } },
      },
      result: {
        data: {
          case: testCase2,
        },
      },
    }
  })
