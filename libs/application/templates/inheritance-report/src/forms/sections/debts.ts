import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { AllDebts, ApplicationDebts } from '../../types'

export const debts = buildSection({
  id: 'debts',
  title: m.debtsTitle,
  children: [
    buildSubSection({
      id: 'domesticAndForeignDebts',
      title: m.debtsTitle,
      children: [
        buildMultiField({
          id: 'domesticAndForeignDebts',
          title: m.debtsAndFuneralCost,
          description: m.debtsAndFuneralCostDescription,
          children: [
            buildDescriptionField({
              id: 'domesticAndForeignDebtsHeader',
              title: m.domesticAndForeignDebts,
              description: m.domesticAndForeignDebtsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'debts.domesticAndForeignDebts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'debts.domesticAndForeignDebts.data',
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsCreditorName.defaultMessage,
                    id: 'creditorName',
                  },
                  {
                    title: m.creditorsNationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.debtsLoanIdentity.defaultMessage,
                    id: 'loanIdentity',
                  },
                  {
                    title: m.debtsBalance.defaultMessage,
                    id: 'balance',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
                sumField: 'balance',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'publicCharges',
      title: m.publicChargesTitle,
      children: [
        buildMultiField({
          id: 'publicCharges',
          title: m.debtsAndFuneralCost,
          description: m.debtsAndFuneralCostDescription,
          children: [
            buildDescriptionField({
              id: 'publicChargesHeader',
              title: m.publicChargesTitle,
              description: m.publicChargesDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'debts.publicCharges.total',
              title: '',
            }),
            buildTextField({
              title: m.amount.defaultMessage,
              id: 'debts.publicCharges',
              width: 'half',
              variant: 'currency',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'debtsOverview',
      title: m.debtsOverview,
      children: [
        buildMultiField({
          id: 'debtsOverview',
          title: m.debtsOverview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewDomesticAndForeignDebts',
              title: m.debtsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'estateDebtsCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ answers }: Application) => {
                  const allDebts = (
                    answers.debts as unknown as ApplicationDebts
                  ).domesticAndForeignDebts.data
                  return (
                    allDebts.map((debt: AllDebts) => ({
                      title: debt.creditorName,
                      description: [
                        `${m.nationalId.defaultMessage}: ${formatNationalId(
                          debt.nationalId ?? '',
                        )}`,
                        `${m.debtsLoanIdentity.defaultMessage}: ${
                          debt.loanIdentity ?? ''
                        }`,
                        `${m.debtsBalance.defaultMessage}: ${formatCurrency(
                          debt.balance ?? '0',
                        )}`,
                      ],
                    })) ?? []
                  )
                },
              },
            ),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    getValueViaPath(
                      answers,
                      'debts.domesticAndForeignDebts.total',
                    ),
                  ),
                ),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewPublicCharges',
              title: m.publicChargesTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'chargesCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ answers }: Application) => {
                  const publicCharges = (
                    answers.debts as unknown as ApplicationDebts
                  ).publicCharges
                  return publicCharges
                    ? [
                        {
                          title: m.publicChargesTitle.defaultMessage,
                          description: [`${formatCurrency(publicCharges)}`],
                        },
                      ]
                    : []
                },
              },
            ),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) => {
                const value =
                  getValueViaPath<string>(answers, 'debts.publicCharges') || '0'
                return formatCurrency(value)
              },
            }),
            buildDividerField({}),
            buildCustomField({
              title: '',
              id: 'debts.debtsTotal',
              doesNotRequireAnswer: true,
              component: 'CalculateTotalDebts',
            }),
          ],
        }),
      ],
    }),
  ],
})
