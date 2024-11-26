import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildInformationFormField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { seminar as seminarMessages } from '../../../lib/messages'
import { ExternalData, FormValue } from '@island.is/application/types'
import { isPersonType } from '../../../utils'

export const seminarInformationSection = buildSection({
  id: 'seminarInformation',
  title: seminarMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'seminarInformationMultiField',
      title: seminarMessages.general.pageTitle,
      description: seminarMessages.general.pageDescription,
      children: [
        buildInformationFormField({
          paddingX: 3,
          paddingY: 3,
          items: [
            {
              label: seminarMessages.labels.seminarType,
              value: 'Stafrænt ADR-endurnýjun. Grunnnámskeið.',
            },
            {
              label: seminarMessages.labels.seminarPrice,
              value: '32.100 kr.',
            },
            {
              label: seminarMessages.labels.seminarBegins,
              value: 'Við skráningu',
            },
            {
              label: seminarMessages.labels.seminarEnds,
              value: 'Er opið í 8 vikur frá skráningu',
            },
            {
              label: seminarMessages.labels.seminarDescription,
              value: 'Lýsing hér',
            },
            {
              label: seminarMessages.labels.seminarLocation,
              value: 'Fræðslukerfi Vinnueftirlitsins (á netinu)',
            },
          ],
        }),
        buildAlertMessageField({
          id: 'seminarInformationAlert',
          title: '',
          message: seminarMessages.labels.alertMessage,
          alertType: 'info',
          marginTop: 3,
          condition: (answers: FormValue, externalData: ExternalData) =>
            isPersonType(externalData),
        }),
      ],
    }),
  ],
})
