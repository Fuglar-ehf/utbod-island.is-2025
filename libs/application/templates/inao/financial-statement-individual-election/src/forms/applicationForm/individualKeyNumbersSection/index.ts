import { buildSection, getValueViaPath } from '@island.is/application/core'
import { GREATER } from '@island.is/libs/application/templates/inao/shared/utils/constants'
import { m } from '../../../lib/utils/messages'
import { operatingCostSubSection } from './operatingcostSubSection'
import { equityAndLiabilitiesSubSection } from './equitiesAndLiabilitiesSubSection'
import { capitalNumberSection } from './capitalNumbersSection'

export const individualKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: (answers) => {
    const greaterThanLimit =
      getValueViaPath(answers, 'election.incomeLimit') === GREATER
    return greaterThanLimit
  },
  children: [
    operatingCostSubSection,
    capitalNumberSection,
    equityAndLiabilitiesSubSection,
  ],
})
