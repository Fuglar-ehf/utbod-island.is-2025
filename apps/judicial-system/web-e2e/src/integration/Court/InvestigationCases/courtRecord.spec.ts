import faker from 'faker'

import {
  Case,
  CaseDecision,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  IC_CONFIRMATION_ROUTE,
  IC_COURT_RECORD_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  makeInvestigationCase,
  makeProsecutor,
  intercept,
} from '../../../utils'

describe(`${IC_COURT_RECORD_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill court attendees', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)

    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('courtAttendees').should('not.match', ':empty')
  })

  it('should autofill sessionBookings in restraining order cases', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.RESTRAINING_ORDER,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)

    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings in expulsion from home cases', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.EXPULSION_FROM_HOME,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)

    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings in autopsy cases', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.AUTOPSY,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)

    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings when defendant is present in court', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      prosecutor: makeProsecutor(),
      sessionArrangements: SessionArrangements.ALL_PRESENT,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings when a spokesperson is present in court', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      prosecutor: makeProsecutor(),
      sessionArrangements: SessionArrangements.ALL_PRESENT_SPOKESPERSON,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings when a prosecutor is present in court', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      prosecutor: makeProsecutor(),
      sessionArrangements: SessionArrangements.PROSECUTOR_PRESENT,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should not allow users to continue if conclusion is not set', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      decision: CaseDecision.ACCEPTING,
      conclusion: undefined,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('formFooter')
      .children()
      .getByTestid('infobox')
      .should('exist')
  })

  it('should not allow users to continue if decision is not set', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      conclusion: faker.lorem.words(5),
      decision: undefined,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('formFooter')
      .children()
      .getByTestid('infobox')
      .should('exist')
  })

  it('should not allow users to continue if ruling is not set', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      conclusion: faker.lorem.words(5),
      decision: CaseDecision.ACCEPTING,
      ruling: undefined,
    }

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('formFooter')
      .children()
      .getByTestid('infobox')
      .should('exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      decision: CaseDecision.ACCEPTING,
      conclusion: faker.lorem.words(5),
      ruling: faker.lorem.words(5),
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    cy.getByTestid('sessionBookings').type(faker.lorem.words(5))
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('endOfSessionBookings').type(faker.lorem.words(5))
    cy.getByTestid('datepicker').last().clear().type('17.12.2021')
    cy.clickOutside()
    cy.getByTestid('courtEndTime-time').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_CONFIRMATION_ROUTE)
  })
})
