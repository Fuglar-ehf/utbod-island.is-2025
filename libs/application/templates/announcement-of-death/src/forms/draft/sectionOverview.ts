import {
  buildMultiField,
  buildSubmitField,
  buildSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import {
  additionalInfo,
  extraInfo,
  files,
  inheritance,
  properties,
  testament,
  theAnnouncer,
  theDeceased,
} from '../overviewSections'

export const sectionOverview = buildSection({
  id: 'overview',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewSectionTitle,
      space: 2,
      description: m.overviewSectionDescription,
      children: [
        ...theDeceased,
        ...theAnnouncer,
        ...testament,
        ...inheritance,
        ...properties,
        ...files,
        ...extraInfo,
        ...additionalInfo,
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
