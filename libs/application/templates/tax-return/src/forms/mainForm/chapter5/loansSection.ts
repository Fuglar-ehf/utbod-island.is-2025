import {
  buildMultiField,
  buildStaticTableField,
  buildSubSection,
} from '@island.is/application/core'

import { TaxReturnData } from '../../../lib/data-types'

// Other loans in DB
export const loansSection = buildSubSection({
  id: 'loansSection',
  title: 'Aðrar skuldir og vaxtagjöld',
  children: [
    buildMultiField({
      id: 'loansOverview',
      title: 'Aðrar skuldir og vaxtagjöld',
      children: [
        buildStaticTableField({
          title: '',
          header: ['Skuldir', 'Vaxtagjöld', 'Eftirstöðvar'],
          rows: (application) => {
            const payments =
              (application.externalData?.getData?.data as TaxReturnData)
                ?.mortgages ?? []

            if (!payments.length) return []

            return payments.map((entry) => [
              entry.loanProvider,
              entry.principal.toLocaleString('is-IS'),
              entry.interest.toLocaleString('is-IS'),
            ])
          },
          summary: (application) => {
            const payments =
              (application.externalData?.getData?.data as TaxReturnData)
                ?.mortgages ?? []

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
