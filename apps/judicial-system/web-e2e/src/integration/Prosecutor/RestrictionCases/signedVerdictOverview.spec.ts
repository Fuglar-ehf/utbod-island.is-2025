import { SIGNED_VERDICT_OVERVIEW } from '@island.is/judicial-system/consts'
import { Case, CaseState, UserRole } from '@island.is/judicial-system/types'

import {
  intercept,
  makeRestrictionCase,
  makeProsecutor,
  makeCaseFile,
} from '../../../utils'

describe('Signed verdict overview - Prosecutor - Restriction cases', () => {
  const caseFile = makeCaseFile('caseId', 'caseFileName')
  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const prosecutor = makeProsecutor()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor,
      state: CaseState.ACCEPTED,
      validToDate: '2022-06-16T19:51:39.466Z',
      creatingProsecutor: prosecutor,
      caseFiles: [caseFile],
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('caseDates').should('exist')
    cy.get('[data-testid="modfyRulingButton"]').should('not.exist')

    cy.get('input[name="sharedWithProsecutorsOfficeId"]')
    cy.get('[aria-controls="caseFilesAccordionItem"]').click()

    cy.get('#caseFilesAccordionItem').within(() => {
      cy.get(`[aria-label="Opna ${caseFile.name}"]`)
    })
  })
})
