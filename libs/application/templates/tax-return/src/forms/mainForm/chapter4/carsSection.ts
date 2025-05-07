import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { TaxReturnData } from '../../../lib/data-types'

export const carsSection = buildSubSection({
  id: 'assets',
  title: 'Eignir ársins ' + (new Date().getFullYear() - 1),
  children: [
    buildMultiField({
      id: 'carOverview',
      title: 'Yfirlit yfir bíla',
      children: [
        buildTableRepeaterField({
          id: 'tableRepeater',
          title: '',
          addItemButtonText: 'Bæta við launagreiðanda',
          saveItemButtonText: 'Vista',
          removeButtonTooltipText: 'Eyða',
          editButtonTooltipText: 'Breyta',
          editField: true,
          maxRows: 10,
          getStaticTableData: (_application) => {
            const income =
              (_application.externalData?.getData?.data as TaxReturnData)
                ?.cars ?? []

            return income.map((entry) => {
              return {
                licence: entry.registrationNumber,
                year: entry.yearBought.toString(),
                amount: entry.amount.toLocaleString(),
              }
            })
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            licence: {
              component: 'input',
              label: 'Bílnúmer',
              width: 'half',
              required: true,
              type: 'text',
            },

            year: {
              component: 'input',
              label: 'Kaupár',
              width: 'half',
              required: true,
              type: 'text',
            },

            amount: {
              component: 'input',
              label: 'Kaupverð',
              width: 'half',
              required: true,
              type: 'text',
            },
          },
          table: {
            // Format values for display in the table
            format: {
              nationalIdWithName: (value) => {
                return `${value} - custom format`
              },
              input: (value) => `${value} - custom format`,
            },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: ['Nafn launagreiðanda', 'Kennitala', 'Laun'],
          },
        }),
      ],
    }),
  ],
})
