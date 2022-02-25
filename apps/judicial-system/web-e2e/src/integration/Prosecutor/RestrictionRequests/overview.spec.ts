import { Case, Defendant } from '@island.is/judicial-system/types'
import {
  makeCustodyCase,
  makeCourt,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'
import { STEP_SIX_ROUTE } from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${STEP_SIX_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      defendants: [
        {
          name: 'Donald Duck',
          address: 'Batcave 1337',
          nationalId: '000000-0000',
        } as Defendant,
      ],
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      arrestDate: '2020-09-16T19:50:08.033Z',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
      court: makeCourt(),
      creatingProsecutor: makeProsecutor(),
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    cy.visit(`${STEP_SIX_ROUTE}/test_id_stadfesta`)

    intercept(caseDataAddition)
  })

  it('should have an overview of the current case', () => {
    cy.getByTestid('infoCard').contains(
      'Donald Duck, kt. 000000-0000, Batcave 1337',
    )
    cy.getByTestid('infoCardDataContainer1').contains('Héraðsdómur Reykjavíkur')
    cy.getByTestid('infoCardDataContainer2').contains(
      'Lögreglan á Höfuðborgarsvæðinu',
    )
    cy.getByTestid('infoCardDataContainer3').contains(
      'Miðvikud. 16. september 2020 eftir kl. 19:50',
    )
    cy.getByTestid('infoCardDataContainer4').contains('Áki Ákærandi')
    cy.getByTestid('infoCardDataContainer5').contains(
      'Miðvikud. 16. september 2020 kl. 19:50',
    )
    cy.getByTestid('demands').contains(
      'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should have a button that links to a pdf of the case', () => {
    cy.contains('button', 'Krafa - PDF')
  })

  it.skip('should navigate to /krofur on successful confirmation', () => {
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
