import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const EditsRequireAction: Form = buildForm({
  id: 'ParentalLeaveEditsRequireAction',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REJECTED,
  children: [
    buildSection({
      id: 'EditsRequireAction.section',
      title: parentalLeaveFormMessages.editFlow.editsNotApprovedTitle,
      children: [
        buildCustomField({
          id: 'editsRequireAction.field',
          title: parentalLeaveFormMessages.editFlow.editsNotApprovedTitle,
          component: 'EditsRequireAction',
        }),
      ],
    }),
  ],
})
