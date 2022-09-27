import { CREATE_RESTRICTION_CASE_ROUTE } from '@island.is/judicial-system/consts'

describe(CREATE_RESTRICTION_CASE_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(CREATE_RESTRICTION_CASE_ROUTE)
  })

  it('should require a valid data', () => {
    cy.get('#policeCaseNumbers').type('0').type('{enter}')
    cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 0)
    cy.get('#policeCaseNumbers').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('#policeCaseNumbers').type('007202201').type('{enter}')
    cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 1)
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // National id
    cy.getByTestid('nationalId').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 000000-0000')
    cy.getByTestid('nationalId').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('nationalId').clear().type('0000000000')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('accusedAddress').should('have.value', 'Jokersway 90')
    cy.getByTestid('accusedName').should('have.value', 'The Joker')
    cy.getByTestid('select-defendantGender').should('contain', 'Karl')

    // Birth date
    cy.get('[type="checkbox"]').check()
    cy.getByTestid('nationalId').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 00.00.0000')
    cy.getByTestid('nationalId').clear().type('01.01.2000')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // Address
    cy.getByTestid('accusedAddress').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedAddress').clear().type('Sidwellssongata 300')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')
  })

  it('should display a warning if the user enters a lawyer that is not in the lawyer registry', () => {
    cy.get('#react-select-defenderName-input')
      .type('click', { force: true })
      .type('{enter}')
    cy.getByTestid('defenderNotFound').should('exist')
  })

  it('should not allow users to move forward if they entered an invalid defender email address or an invalid defender phonenumber', () => {
    cy.get('#policeCaseNumbers').type('00000000000').type('{enter}')
    cy.getByTestid('nationalId').type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('nationalId').blur()
    cy.getByTestid('accusedName').type('Donald Duck')
    cy.getByTestid('accusedAddress').type('Batcave 1337')
    cy.getByTestid('select-defendantGender').click()
    cy.get('#react-select-defendantGender-option-0').click()
    cy.getByTestid('leadInvestigator').type('John Doe')
    cy.getByTestid('continueButton').should('not.be.disabled')

    cy.getByTestid('defenderEmail').type('ill formed email address')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('defenderEmail').clear()
    cy.getByTestid('defenderPhoneNumber').type('000')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('defenderPhoneNumber').clear().type('1234567')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })
})
