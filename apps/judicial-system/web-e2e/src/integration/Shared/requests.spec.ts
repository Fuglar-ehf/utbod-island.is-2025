import { REQUEST_LIST_ROUTE } from '@island.is/judicial-system/consts'

describe(REQUEST_LIST_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(REQUEST_LIST_ROUTE)
  })

  it.skip('should have a table with one row that is a button', () => {
    cy.getByTestid('custody-requests-table-row').should(
      'have.attr',
      'role',
      'button',
    )
  })

  it.skip('should have a button that allows me to create a custody and travel ban requests', () => {
    cy.contains('Stofna nýja kröfu').click()
    cy.contains('a', 'Gæsluvarðhald')
    cy.contains('a', 'Farbann')
  })

  it.skip('should have a button that allows me to delete cases', () => {
    cy.getByTestid('deleteCase').click()
    cy.contains('button', 'Afturkalla')
  })
})
