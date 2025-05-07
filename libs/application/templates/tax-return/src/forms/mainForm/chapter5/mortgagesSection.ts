import {
  buildDescriptionField,
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
        buildStaticTableField({
          title: 'Yfirlit yfir veðskuldir',
          header: [
            'Kaupár',
            'Kennitala',
            'Lánveitandi',
            'Lánsnúmer',
            // 'Lántökudagur',
            'Lánstími ár',
          ],
          rows: (application) => {
            const loans =
              (application.externalData?.getData?.data as TaxReturnData)
                ?.loans ?? []

            return loans.map((loan) => [
              loan.yearBought.toString(),
              loan.loanProviderNationalId,
              loan.loanProvider,
              loan.loanId,
              // loan.date.toString(),
              loan.periodOfLoan.toString(),
            ])
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

            const totalRemaining = payments.reduce(
              (sum, p) => sum + (p.remaining || 0),
              0,
            )

            return [
              {
                label: 'Samtals vaxtagjöld:',
                value: `${totalInterest.toLocaleString('is-IS')} kr.`,
              },
              {
                label: 'Samtals eftirstöðvar:',
                value: `${totalRemaining.toLocaleString('is-IS')} kr.`,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
