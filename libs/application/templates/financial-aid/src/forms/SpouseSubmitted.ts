import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form } from '@island.is/application/types'
import { Routes } from '../lib/constants'

import * as m from '../lib/messages'

export const SpouseSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSESTATUS,
      title: m.status.pageTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSESTATUS,
          title: m.status.spousePageTitle,
          component: 'SpouseStatus',
        }),
        // Empty submit field to hide all buttons in the footer
        buildSubmitField({
          id: '',
          title: '',
          actions: [],
        }),
      ],
    }),
    buildMultiField({
      id: Routes.MISSINGFILES,
      title: m.missingFiles.general.pageTitle,
      children: [
        buildCustomField(
          {
            id: Routes.MISSINGFILES,
            title: m.missingFiles.general.pageTitle,
            component: 'MissingFiles',
          },
          { isSpouse: true },
        ),
        buildSubmitField({
          id: 'missingFilesSubmit',
          title: '',
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: m.missingFiles.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    buildCustomField({
      id: Routes.MISSINGFILESCONFIRMATION,
      title: m.missingFiles.confirmation.title,
      component: 'MissingFilesConfirmation',
    }),
  ],
})
