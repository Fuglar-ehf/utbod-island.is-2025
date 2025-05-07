import { buildSection } from '@island.is/application/core'
import { mortgagesSection } from './mortgagesSection'
import { loansSection } from './loansSection'

// Chapter 5 of Skattframtal
export const chapter5Section = buildSection({
  id: 'chapter5Section',
  title: 'Skuldir og vaxtagjöld ' + (new Date().getFullYear() - 1),
  children: [mortgagesSection, loansSection],
})
