import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { secondSection } from '../mainForm/secondSection'
import { chapter2Section } from './chapter2/chapter2Section'
import { overviewSection } from './overview'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [chapter2Section, secondSection, overviewSection],
})
