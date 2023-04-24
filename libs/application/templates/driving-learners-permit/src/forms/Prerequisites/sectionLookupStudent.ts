import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
export const sectionLookupStudent = buildSubSection({
  id: 'requirements',
  title: m.applicationStudentRequirementsTitle,
  children: [
    buildMultiField({
      id: 'studentMentorability',
      title: m.applicationStudentLookupTitle,
      description: m.studentInfoHeading,
      children: [
        buildCustomField({
          title: m.applicationStudentLookupTitle,
          component: 'LookupStudent',
          id: 'studentMentorability',
        }),
      ],
    }),
  ],
})
