import { CyHttpMessages } from 'cypress/types/net-stubbing'
import faker from 'faker'

import {
  Case,
  Gender,
  CaseState,
  CaseType,
  Institution,
  InstitutionType,
  User,
  UserRole,
  CaseOrigin,
} from '@island.is/judicial-system/types'

export const intercept = (res: Case) => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    if (hasOperationName(req, 'CaseQuery')) {
      req.reply({
        data: {
          case: res,
        },
      })
    }
  }).as('gqlCaseQuery')
}

export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  const { body } = req
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}

// Alias query if operationName matches
export const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}

export const investigationCaseAccusedName = `${faker.name.firstName()} ${faker.name.lastName()}`
export const investigationCaseAccusedAddress = faker.address.streetAddress()

export const makeCustodyCase = (): Case => {
  return {
    id: 'test_id',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:51:39.466Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type: CaseType.CUSTODY,
    policeCaseNumber: '007-2021-202000',
    defendants: [
      {
        id: 'test_defendant_id',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        caseId: 'test_id',
        nationalId: '000000-0000',
        name: 'Donald Duck',
        gender: Gender.MALE,
        address: 'Batcave 1337',
      },
    ],
  }
}

export const makeInvestigationCase = (): Case => {
  const caseId = faker.datatype.uuid()
  return {
    id: caseId,
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type: CaseType.INTERNET_USAGE,
    court: {
      id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:50:08.033Z',
      type: InstitutionType.COURT,
      name: 'Héraðsdómur Reykjavíkur',
    },
    policeCaseNumber: '007-2021-202000',
    defendants: [
      {
        id: 'test_defendant_id',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        caseId,
        nationalId: '000000-0000',
        name: investigationCaseAccusedName,
        gender: Gender.MALE,
        address: investigationCaseAccusedAddress,
      },
    ],
  }
}

export const makeProsecutor = (): User => {
  return {
    id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    name: 'Áki Ákærandi',
    nationalId: '000000-0000',
    mobileNumber: '000-0000',
    email: 'prosecutor@law.is',
    role: UserRole.PROSECUTOR,
    active: true,
    title: 'aðstoðarsaksóknari',
    institution: {
      id: '',
      created: '',
      modified: '',
      type: InstitutionType.PROSECUTORS_OFFICE,
      name: 'Lögreglan á Höfuðborgarsvæðinu',
    },
  }
}

export const makeCourt = (): Institution => {
  return {
    id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    type: InstitutionType.COURT,
    name: 'Héraðsdómur Reykjavíkur',
  }
}
