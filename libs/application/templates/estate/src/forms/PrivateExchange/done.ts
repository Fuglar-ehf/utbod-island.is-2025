import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const done: Form = buildForm({
  id: 'PrivateExchangeDone',
  title: '',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.doneTitle,
      description: m.privateExchangeSubtitle,
      children: [
        buildCustomField({
          id: 'doneImage',
          component: 'DoneImage',
          title: '',
        }),
      ],
    }),
  ],
})
