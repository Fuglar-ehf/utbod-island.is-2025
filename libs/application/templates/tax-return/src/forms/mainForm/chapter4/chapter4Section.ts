import { buildSection } from '@island.is/application/core'
import { carsSection } from './carsSection'
import { realestatesSection } from './realestatesSection'

// Chapter 4 of Skattframtal
export const chapter4Section = buildSection({
  id: 'chapter4',
  title: 'Eignir ársins ' + (new Date().getFullYear() - 1),
  children: [realestatesSection, carsSection],
})
