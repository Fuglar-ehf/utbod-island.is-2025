import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { TaxReturnData } from '../../lib/data-types'

export const firstSection = buildSection({
  id: 'income',
  title: 'Tekjur ársins 2024',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: 'Tekjur ársins' + new Date().getFullYear(),
      children: [
        buildDescriptionField({
          id: 'incomeData',
          title: '',
          description: ({ externalData }) => {
            const income =
              (externalData?.getData?.data as TaxReturnData)?.income ?? []
            if (!income.length) {
              return 'Engar tekjur fundust.'
            }

            return income
              .map(
                (entry) =>
                  `${entry.employer}: ${entry.income.toLocaleString()} kr.`,
              )
              .join('\n')
          },
        }),
        buildDescriptionField({
          id: 'description',
          title: 'Description',
          description: 'This is a description, should come from messages.ts',
        }),
        buildTextField({
          id: 'input',
          title: 'Input',
          description: 'This is an input, should come from messages.ts',
        }),
      ],
    }),
  ],
})
