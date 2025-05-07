import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { TaxReturnData } from '../../../lib/data-types'

export const realestatesSection = buildSubSection({
  id: 'realestatesSection',
  title: 'Innlendar fasteignir',
  children: [
    buildMultiField({
      id: 'realestatesSectionRepeter',
      title: '',
      children: [
        buildTableRepeaterField({
          id: 'tableRepeater',
          title: '',
          addItemButtonText: 'Bæta við fasteign',
          saveItemButtonText: 'Vista',
          removeButtonTooltipText: 'Eyða',
          editButtonTooltipText: 'Breyta',
          editField: true,
          maxRows: 10,
          getStaticTableData: (_application) => {
            const income =
              (_application.externalData?.getData?.data as TaxReturnData)
                ?.realestates ?? []

            return income.map((entry) => {
              return {
                id: entry.registrationNumber,
                address: entry.address,
                value: entry.realestateValue.toLocaleString(),
              }
            })
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            id: {
              component: 'input',
              label: 'Fastanúmer',
              width: 'half',
              required: true,
              type: 'text',
            },

            address: {
              component: 'input',
              label: 'Heimilisfang',
              width: 'half',
              required: true,
              type: 'text',
            },

            value: {
              component: 'input',
              label: 'Fasteignamat',
              width: 'half',
              required: true,
              type: 'text',
            },
          },
          table: {
            // Format values for display in the table
            format: {
              id: (value) => {
                return `${value}`
              },
              address: (value) => `${value}`,
            },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: [
              'Fastanúmer eignar',
              'Staðsetning eignar',
              'Fasteignamat ' + (new Date().getFullYear() - 1),
            ],
          },
        }),
      ],
    }),
  ],
})
