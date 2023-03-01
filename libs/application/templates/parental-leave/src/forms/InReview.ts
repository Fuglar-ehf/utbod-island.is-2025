import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { States } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField({
          id: 'InReviewSteps',
          title: '',
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
