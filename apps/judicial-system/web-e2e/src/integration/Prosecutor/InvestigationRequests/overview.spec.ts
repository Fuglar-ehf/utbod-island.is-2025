import faker from 'faker'

import {
  investigationCaseAccusedAddress,
  investigationCaseAccusedName,
  makeInvestigationCase,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'

import { intercept } from '../../../utils'

describe('/krafa/rannsoknarheimild/stadfesta/:id', () => {
  const demands = faker.lorem.paragraph()
  const defenderName = faker.name.findName()
  const defenderEmail = faker.internet.email()
  const defenderPhoneNumber = faker.phone.phoneNumber()

  beforeEach(() => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      demands,
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      requestedCourtDate: '2020-09-20T19:50:08.033Z',
    }

    cy.stubAPIResponses()
    cy.visit('/krafa/rannsoknarheimild/stadfesta/test_id')

    intercept(caseDataAddition)
  })

  it('should display information about the case in an info card', () => {
    cy.getByTestid('infoCard').contains(
      `${investigationCaseAccusedName}, kt. 000000-0000, ${investigationCaseAccusedAddress}`,
    )
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCard').contains('007-2021-202000') // Police case number
    cy.getByTestid('infoCard').contains('16.09.2020') // Created
    cy.getByTestid('infoCard').contains('Lögreglan á Höfuðborgarsvæðinu') // Institution
    cy.getByTestid('infoCard').contains(
      'Sunnud. 20. september 2020 eftir kl. 19:50',
    ) // Requested court date
    cy.getByTestid('infoCard').contains('Áki Ákærandi aðstoðarsaksóknari') // Prosecutor
    cy.getByTestid('infoCard').contains('Upplýsingar um vefnotkun') // Type
  })

  it('should display the demands', () => {
    cy.contains(demands)
  })

  it('should display a button to view request as PDF', () => {
    cy.getByTestid('requestPDFButton').should('exist')
  })

  it('should navigate to /krofur on successful confirmation', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('contain', '/krofur')

    /**
     * This is practically considered bad(ish) practice since we're not testing
     * the overview in isolation anymore. Leaving this here until a better
     * way presents itself.
     */
    cy.getByTestid('tdTag').should('contain', 'Krafa móttekin')
  })
})
