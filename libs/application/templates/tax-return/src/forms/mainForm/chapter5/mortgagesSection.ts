import {
  buildMultiField,
  buildStaticTableField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { TaxReturnData } from '../../../lib/data-types'

export const mortgagesSection = buildSubSection({
  id: 'mortgagesSection',
  title: 'Veðskuldir',
  children: [
    buildMultiField({
      id: 'mortgageOverview',
      title: '',
      children: [
        buildTableRepeaterField({
          id: 'mortgageTableRepeater',
          title: '',
          addItemButtonText: 'Bæta við veðskuld',
          saveItemButtonText: 'Vista',
          removeButtonTooltipText: 'Eyða',
          editButtonTooltipText: 'Breyta',
          editField: true,
          maxRows: 10,
          getStaticTableData: (_application) => {
            const loans =
              (_application.externalData?.getData?.data as TaxReturnData)
                ?.loans ?? []

            return loans.map((loan) => ({
              lenderYear: loan.yearBought.toString(),
              nationalId: loan.loanProviderNationalId,
              lenderName: loan.loanProvider,
              mortgageNumber: loan.loanId,
              date: loan.date.toLocaleDateString('is-IS'),
              yearsLeft: loan.periodOfLoan.toString(),
            }))
          },
          fields: {
            lenderName: {
              component: 'input',
              label: 'Lánveitandi',
              width: 'half',
              required: true,
              type: 'text',
            },
            lenderNationalId: {
              component: 'input',
              label: 'Kennitala lánveitanda',
              width: 'half',
              required: true,
              type: 'text',
            },
            principal: {
              component: 'input',
              label: 'Upphæð',
              width: 'half',
              required: true,
              type: 'text',
            },
            collateral: {
              component: 'input',
              label: 'Trygging',
              width: 'half',
              required: false,
              type: 'text',
            },
          },
          table: {
            format: {
              input: (value) => `${value}`,
            },
            header: ['Lánveitandi', 'Kennitala', 'Upphæð', 'Trygging'],
          },
        }),
      ],
    }),
  ],
})
