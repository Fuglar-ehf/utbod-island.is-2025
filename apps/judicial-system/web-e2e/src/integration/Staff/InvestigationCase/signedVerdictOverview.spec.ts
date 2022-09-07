import faker from 'faker'
import { SIGNED_VERDICT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { intercept, makeCourt, mockCase, makeCaseFile } from '../../../utils'

describe('Signed verdict overview - Staff - Investigation case', () => {
  const conclusion = faker.lorem.paragraph(1)
  const caseFile = makeCaseFile('caseId', 'caseFileName')

  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      state: CaseState.ACCEPTED,
      court: makeCourt(),
      conclusion,
      caseFiles: [caseFile],
    }

    cy.login(UserRole.STAFF)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('courtRecordPDFButton')
    cy.getByTestid('accordionItems').should('not.exist')
    cy.getByTestid('requestPDFButton').should('not.exist')
    cy.getByTestid('rulingPDFButton').should('not.exist')
  })
})
