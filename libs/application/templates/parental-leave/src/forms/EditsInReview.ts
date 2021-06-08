import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const EditsInReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: parentalLeaveFormMessages.reviewScreen.titleInReview,
      children: [
        buildCustomField({
          id: 'EditsInReviewSteps',
          title: parentalLeaveFormMessages.reviewScreen.titleInReview,
          component: 'EditsInReviewSteps',
        }),
      ],
    }),
  ],
})
