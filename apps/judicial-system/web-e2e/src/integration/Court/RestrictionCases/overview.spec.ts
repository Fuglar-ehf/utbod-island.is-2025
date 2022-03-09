import faker from 'faker'

import {
  Case,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseState,
} from '@island.is/judicial-system/types'
import {
  makeCustodyCase,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'
import {
  HEARING_ARRANGEMENTS_ROUTE,
  OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${OVERVIEW_ROUTE}/:id`, () => {
  const demands = faker.lorem.paragraph()
  const lawsBroken = faker.lorem.words(5)
  const legalBasis = faker.lorem.words(5)

  beforeEach(() => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      creatingProsecutor: makeProsecutor(),
      prosecutor: makeProsecutor(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      arrestDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
      demands,
      lawsBroken,
      legalBasis,
      legalProvisions: [CaseLegalProvisions._95_1_A],
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
      ],
    }

    cy.stubAPIResponses()
    cy.visit(`${OVERVIEW_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)
  })

  it('should have an overview of the current case', () => {
    cy.getByTestid('infoCard').contains(
      'Donald Duck, kt. 000000-0000, Batcave 1337',
    )
    cy.getByTestid('infoCardDataContainer0').contains(
      'Lögreglan á Höfuðborgarsvæðinu',
    )
    cy.getByTestid('infoCardDataContainer1').contains(
      'Miðvikud. 16. september 2020 eftir kl. 19:50',
    )
    cy.getByTestid('infoCardDataContainer2').contains('Áki Ákærandi')
    cy.getByTestid('infoCardDataContainer3').contains(
      'Miðvikud. 16. september 2020 kl. 19:50',
    )
  })

  it('should display the correct demands, laws broken, legal provisions, and requested custody restriction', () => {
    cy.contains(demands)
    cy.contains(lawsBroken)
    cy.contains('a-lið 1. mgr. 95. gr. sml.')
    cy.contains(legalBasis)
    cy.contains('E - Fjölmiðlabann')
    cy.contains('B - Einangrun')
  })

  it('should have a button to a PDF of the case', () => {
    cy.contains('button', 'Krafa - PDF')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').click()
    cy.url().should('include', HEARING_ARRANGEMENTS_ROUTE)
  })
})
