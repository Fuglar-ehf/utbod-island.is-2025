import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const operatorSubSection = buildSubSection({
  id: 'operatorSubSection',
  title: information.labels.operator.sectionTitle,
  children: [
    buildMultiField({
      id: 'operatorMultiField',
      title: information.labels.operator.title,
      description: information.labels.operator.description,
      children: [
        buildCustomField({
          id: 'oldOperators',
          component: 'OldOperators',
          title: '',
          doesNotRequireAnswer: true,
        }),
        buildCustomField({
          id: 'operators',
          component: 'OperatorRepeater',
          title: '',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
