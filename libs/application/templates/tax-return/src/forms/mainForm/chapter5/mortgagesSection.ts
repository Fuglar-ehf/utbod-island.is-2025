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
      title: 'Vaxtagjöld vegna íbúðarhúsnæðis til eigin nota',
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
              // date: loan.date.toString(),
              yearsLeft: loan.periodOfLoan.toString(),
            }))
          },
          fields: {
            mortgageNumber: {
              component: 'input',
              label: 'Lánsnúmer',
              width: 'half',
              required: true,
              type: 'text',
            },
          },
          table: {
            format: {
              input: (value) => `${value}`,
            },
            header: [
              'Kaupár',
              'Kennitala',
              'Lánveitandi',
              'Lánsnúmer',
              //  'Lántökudagur',
              'Lánstími ár',
            ],
          },
        }),
        buildStaticTableField({
          title: 'Upplýsingar um greiðslur',
          header: [
            'Heildargreiðslur',
            'Afborganir á nafnverði',
            'Vaxtagjöld',
            'Eftirstöðvar',
          ],
          rows: (application) => {
            const payments =
              (application.externalData?.getData?.data as TaxReturnData)
                ?.loans ?? []

            if (!payments.length) return []

            return payments.map((entry) => [
              entry.yearBought.toString(),
              entry.principal.toLocaleString('is-IS'),
              entry.interest.toLocaleString('is-IS'),
              entry.remaining.toLocaleString('is-IS'),
            ])
          },

          summary: (application) => {
            const payments =
              (application.externalData?.getData?.data as TaxReturnData)
                ?.loans ?? []

            const totalInterest = payments.reduce(
              (sum, p) => sum + (p.interest || 0),
              0,
            )

            const totalLoan = payments.reduce(
              (sum, p) => sum + (p.principal || 0),
              0,
            )

            return [
              {
                label: 'Samtals vaxtagjöld:',
                value: `${totalInterest.toLocaleString('is-IS')} kr.`,
              },
              {
                label: 'Samtals eftirstöðvar:',
                value: `${totalLoan.toLocaleString('is-IS')} kr.`,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
