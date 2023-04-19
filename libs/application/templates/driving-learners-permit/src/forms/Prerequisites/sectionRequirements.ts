import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const sectionRequirements = buildSubSection({
  id: 'requirements',
  title: m.applicationEligibilityTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.eligibilityRequirementTitle,
      description: m.applicationEligibilityRequirementDescription,
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'EligibilitySummary',
          id: 'eligsummary',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'Senda inn umsókn',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Senda inn umsókn',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
