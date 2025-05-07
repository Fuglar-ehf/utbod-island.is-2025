import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { chapter4Section } from './chapter4/chapter4Section'
import { chapter2Section } from './chapter2/chapter2Section'
import { overviewSection } from './overview'
import { chapter5Section } from './chapter5/chapter5Section'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    chapter2Section,
    chapter4Section,
    chapter5Section,
    overviewSection,
  ],
})
