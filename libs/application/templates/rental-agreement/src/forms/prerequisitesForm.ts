import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { intro } from './prerequisites/intro'
import { externalData } from './prerequisites/externalData'

import * as m from '../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisites.intro.sectionTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [intro, externalData],
})
