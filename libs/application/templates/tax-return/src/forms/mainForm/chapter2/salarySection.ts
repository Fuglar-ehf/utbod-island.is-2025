import {
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'

import { TaxReturnData } from '../../../lib/data-types'

export const salarySection = buildSubSection({
  id: 'incomeSection',
  title: 'Launatekjur og starfstengdar greiðslur',
  children: [
    buildMultiField({
      id: 'salarySection',
      title: 'Tekjur ársins ' + (new Date().getFullYear() - 1),
      children: [
        buildTableRepeaterField({
          id: 'salariesTableRepeater',
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
                ?.income ?? []

            return income.map((entry) => {
              return {
                name: entry.employer,
                nrid: entry.employerNationalId,
                amount: entry.income.toLocaleString(),
              }
            })
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: 'National ID with name',
              searchCompanies: true,
              searchPersons: true,
            },

            input: {
              component: 'input',
              label: 'Laun',
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
            header: ['Nafn launagreiðanda', 'Kennitala', 'Laun'],
          },
        }),
      ],
    }),
  ],
})
