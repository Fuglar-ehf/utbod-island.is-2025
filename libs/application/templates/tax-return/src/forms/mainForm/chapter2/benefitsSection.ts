// import { input } from 'libs/island-ui/core/src/lib/Input/Input.mixins'

import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTableRepeaterField,
  buildTextField,
} from '@island.is/application/core'

import { mapIncomeToNameValue } from '../../../helpers/tax-return-data-helper'
import { TaxReturnData } from '../../../lib/data-types'

export const benefitsSection = buildSubSection({
  id: 'benefitsSection',
  title: 'Ökutækjastyrkur, dagpeningar',
  children: [
    buildMultiField({
      id: 'benefitsRepeater',
      title: 'Ökutækjastyrkur, dagpeningar og hlunnindi',
      children: [
        buildTableRepeaterField({
          id: '',
          title: '',
          addItemButtonText: 'Bæta við greiðslu',
          saveItemButtonText: 'Vista',
          removeButtonTooltipText: 'Eyða',
          editButtonTooltipText: 'Breyta',
          editField: true,
          maxRows: 10,
          getStaticTableData: (_application) => {
            const benefits =
              (_application.externalData?.getData?.data as TaxReturnData)
                ?.allowances ?? []

            return benefits.map((entry) => {
              return {
                description: entry.name,
                amount: entry.amount.toLocaleString(),
              }
            })
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            description: {
              component: 'select',
              label: 'Skýring',
              width: 'half',
              options: [
                { label: 'Hlunnindi', value: 'Hlunnindi' },
                { label: 'Ökutækjastyrkur', value: 'Ökutækjastyrkur' },
                { label: 'Dagpeningar', value: 'Dagpeningar' },
              ],
            },

            amount: {
              component: 'input',
              label: 'Fjárhæð',
              width: 'half',
              required: true,
              type: 'text',
            },
          },
          table: {
            // Format values for display in the table
            format: {
              description: (value) => {
                return `${value}`
              },
              amount: (value) => `${value}`,
            },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: ['Skýring', 'Fjárhæð'],
          },
        }),
      ],
    }),
  ],
})
