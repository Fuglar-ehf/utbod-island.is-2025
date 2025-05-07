import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
  buildTableRepeaterField,
  buildSubSection,
} from '@island.is/application/core'
import { TaxReturnData } from '../../../lib/data-types'
import { mapIncomeToNameValue } from '../../../helpers/tax-return-data-helper'
import { input } from 'libs/island-ui/core/src/lib/Input/Input.mixins'

export const benefitsSection = buildSubSection({
  id: 'benefitsSection',
  title: 'Ökutækjastyrkur, dagpeningur',
  children: [
    buildMultiField({
      id: 'benefitsRepeater',
      title: 'Ökutækjastyrkur, dagpeningur og hlunnindi',
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
            const benefits = (
              (_application.externalData?.getData?.data as TaxReturnData)
                ?.benefits ?? []
            ).filter((item) => item.typeOfBenefit === '2.2')

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
                { label: 'Íþróttastyrkur', value: 'Íþróttastyrkur' },
                { label: 'Námsstyrkur', value: 'Námsstyrkur' },
                { label: 'Bifreiðahlunnindi', value: 'Bifreiðahlunnindi' },
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
            // format: {
            //   description: (value) => {
            //     return `${value}`
            //   },
            //   amount: (value) => `${value}`,
            // },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: ['Skýring', 'Fjárhæð'],
          },
        }),
      ],
    }),
  ],
})
