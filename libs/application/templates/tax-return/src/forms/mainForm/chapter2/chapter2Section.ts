import { buildSection } from '@island.is/application/core'
import { salarySection } from './salarySection'
import { benefitsSection } from './benefitsSection'
import { welfarePensionAllowanceSection } from './welfarePensionAllowanceSection'

// Chapter 2 of Skattframtal
export const chapter2Section = buildSection({
  id: 'chapter2',
  title: 'Tekjur ársins ' + (new Date().getFullYear() - 1),
  children: [salarySection, benefitsSection, welfarePensionAllowanceSection],
})
