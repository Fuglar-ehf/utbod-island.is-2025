import * as faker from 'faker'

import { Case, CaseState } from '@island.is/judicial-system/types'
import {
  makeCustodyCase,
  makeCourt,
} from '@island.is/judicial-system/formatters'
import {
  COURT_RECORD_ROUTE,
  HEARING_ARRANGEMENTS_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${HEARING_ARRANGEMENTS_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(`${HEARING_ARRANGEMENTS_ROUTE}/test_id_stadfest`)
  })

  it('should display case comments', () => {
    const caseData = makeCustodyCase()
    const comment = faker.lorem.sentence(1)
    const caseDataAddition: Case = {
      ...caseData,
      comments: comment,
    }

    intercept(caseDataAddition)

    cy.contains(comment)
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    intercept(caseDataAddition)

    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    intercept(caseDataAddition)

    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', `${COURT_RECORD_ROUTE}/test_id_stadfest`)
  })
})
