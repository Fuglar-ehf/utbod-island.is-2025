describe('/krafa/ny/gaesluvardhald', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krafa/ny/rannsoknarheimild')
  })

  it('should require a valid police case number', () => {
    cy.getByTestid('policeCaseNumber').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 012-3456-7890')
    cy.getByTestid('policeCaseNumber').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('policeCaseNumber').clear().type('00000000000')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid accused national id if the user has a national id', () => {
    cy.getByTestid('nationalId').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 000000-0000')
    cy.getByTestid('nationalId').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('nationalId').clear().type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should have a disabled gender and citizenship if the defendant has a business national id', () => {
    cy.getByTestid('nationalId').type('5555555555')
    cy.wait('@getBusinessesByNationalId')
    cy.get('#defendantGender').should(
      'have.class',
      'island-select--is-disabled',
    )
    cy.get('#defendantCitizenship').should('be.disabled')
  })

  it('should not have a disabled gender and citizenship if the defendant has a person national id', () => {
    cy.getByTestid('nationalId').type('1111111111')
    cy.wait('@getPersonByNationalId')
    cy.get('#defendantGender').should(
      'not.have.class',
      'island-select--is-disabled',
    )
    cy.get('#defendantCitizenship').should('not.be.disabled')
  })

  it('should autofill name, address and gender after getting person by national id in national registry', () => {
    cy.getByTestid('nationalId').type('1111111111')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('accusedAddress').should('have.value', 'Jokersway 90')
    cy.getByTestid('accusedName').should('have.value', 'The Joker')
    cy.getByTestid('select-defendantGender').should('contain', 'Karl')
  })

  it('should require a valid accused date of birth if the user does not have a national id', () => {
    cy.get('[type="checkbox"]').check()
    cy.getByTestid('nationalId').type('0').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 00.00.0000')
    cy.getByTestid('nationalId').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('nationalId').clear().type('01.01.2000')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid accused name', () => {
    cy.getByTestid('accusedName').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedName').clear().type('Sidwell Sidwellsson')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid accused address', () => {
    cy.getByTestid('accusedAddress').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedAddress').clear().type('Sidwellssongata 300')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should not allow users to move forward if they entered an invalid defender email address or an invalid defender phonenumber', () => {
    cy.getByTestid('policeCaseNumber').type('00000000000')
    cy.getByTestid('nationalId').type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('nationalId').blur()
    cy.getByTestid('accusedName').type('Donald Duck')
    cy.getByTestid('accusedAddress').type('Batcave 1337')
    cy.getByTestid('select-defendantGender').click()
    cy.get('#react-select-defendantGender-option-0').click()
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
