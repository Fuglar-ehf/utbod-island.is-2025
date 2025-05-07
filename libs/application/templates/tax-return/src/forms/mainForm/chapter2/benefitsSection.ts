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
            const income = (
              (_application.externalData?.getData?.data as TaxReturnData)
                ?.benefits ?? []
            ).filter((item) => item.typeOfBenefit === '2.2')

            return income.map((entry) => {
              return {
                name: entry.from,
                description: entry.name,
                amount: entry.amount.toLocaleString(),
              }
            })
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: 'Nafn fyrirtækis',
              searchCompanies: true,
              searchPersons: true,
            },
            select: {
              component: 'select',
              label: 'Skýring',
              width: 'half',
              options: [
                { label: 'Íþróttastyrkur', value: 'Íþróttastyrkur' },
                { label: 'Námsstyrkur', value: 'Námsstyrkur' },
                { label: 'Bifreiðahlunnindi', value: 'Bifreiðahlunnindi' },
              ],
            },
            input: {
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
              nationalIdWithName: (value) => {
                return `${value}`
              },
              input: (value) => `${value}`,
            },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: ['Nafn fyrirtækis', 'Skýring', 'Fjárhæð'],
          },
        }),
      ],
    }),
  ],
})
