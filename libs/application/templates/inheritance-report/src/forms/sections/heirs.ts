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
import { formatCurrency } from '@island.is/application/ui-components'
import { InheritanceReport } from '../../lib/dataSchema'
import { m } from '../../lib/messages'
import { valueToNumber } from '../../lib/utils/helpers'
import { YES } from '../../lib/constants'

export const heirs = buildSection({
  id: 'heirs',
  title: m.propertyForExchangeAndHeirs,
  children: [
    buildSubSection({
      id: 'spouse',
      title: m.spousesShare,
      children: [
        buildMultiField({
          id: 'spouse',
          title: m.spousesShare,
          description: m.spousesShareDescription,
          children: [
            buildCustomField({
              title: '',
              id: 'spouse',
              doesNotRequireAnswer: false,
              component: 'SpouseEstateShare',
              childInputIds: [
                'spouse.spouseTotalSeparateProperty',
                'spouse.spouseTotalDeduction',
              ],
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'propertyForExchange',
      title: m.propertyForExchangeAndHeirs,
      children: [
        buildMultiField({
          id: 'propertyForExchange',
          title: m.propertyForExchange,
          children: [
            buildKeyValueField({
              label: m.netProperty,
              display: 'flex',
              value: ({ answers }) => {
                return formatCurrency(
                  String(
                    Number(getValueViaPath(answers, 'assets.assetsTotal')) -
                      Number(getValueViaPath(answers, 'debts.debtsTotal')) +
                      Number(
                        getValueViaPath(answers, 'business.businessTotal'),
                      ),
                  ),
                )
              },
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalDeduction,
              display: 'flex',
              value: ({ answers }) => {
                const spouseTotalDeduction = valueToNumber(
                  getValueViaPath(answers, 'spouse.spouseTotalDeduction'),
                )

                return formatCurrency(String(spouseTotalDeduction ?? '0'))
              },
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.netPropertyForExchange,
              display: 'flex',
              value: ({ answers }) => {
                const spouseTotalDeduction = valueToNumber(
                  getValueViaPath(answers, 'spouse.spouseTotalDeduction'),
                )
                const spouseTotalSeparateProperty = valueToNumber(
                  getValueViaPath(
                    answers,
                    'spouse.spouseTotalSeparateProperty',
                  ),
                )

                const wasInCohabitation =
                  getValueViaPath(answers, 'spouse.wasInCohabitation') === YES
                const hadSeparateProperty =
                  getValueViaPath(answers, 'spouse.hadSeparateProperty') === YES

                const deductionValue = !wasInCohabitation
                  ? 0
                  : !hadSeparateProperty
                  ? spouseTotalDeduction
                  : spouseTotalSeparateProperty

                return formatCurrency(
                  String(
                    Number(getValueViaPath(answers, 'assets.assetsTotal')) -
                      Number(getValueViaPath(answers, 'debts.debtsTotal')) +
                      Number(
                        getValueViaPath(answers, 'business.businessTotal'),
                      ) -
                      deductionValue,
                  ),
                )
              },
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirs',
      title: m.heirsAndPartition,
      children: [
        buildMultiField({
          id: 'heirs',
          title: m.heirsAndPartition,
          description: m.heirsAndPartitionDescription,
          children: [
            buildDescriptionField({
              id: 'heirs.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'heirs.data',
                doesNotRequireAnswer: true,
                component: 'HeirsAndPartitionRepeater',
              },
              {
                customFields: [
                  {
                    title: m.heirsRelation.defaultMessage,
                    id: 'relation',
                  },
                  {
                    // sectionTitle: m.heirShare.defaultMessage,
                    title: m.heirsInheritanceRate.defaultMessage,
                    id: 'heirsPercentage',
                  },
                  {
                    title: m.taxFreeInheritance.defaultMessage,
                    id: 'taxFreeInheritance',
                    readOnly: true,
                    currency: true,
                  },
                  {
                    title: m.inheritanceAmount.defaultMessage,
                    id: 'inheritance',
                    readOnly: true,
                    currency: true,
                  },
                  {
                    title: m.taxableInheritance.defaultMessage,
                    id: 'taxableInheritance',
                    readOnly: true,
                    currency: true,
                  },
                  {
                    title: m.inheritanceTax.defaultMessage,
                    id: 'inheritanceTax',
                    readOnly: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.addHeir.defaultMessage,
                sumField: 'heirsPercentage',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsAdditionalInfo',
      title: m.heirAdditionalInfo,
      children: [
        buildMultiField({
          id: 'heirsAdditionalInfo',
          title: m.heirAdditionalInfo,
          description: m.heirAdditionalInfoDescription,
          children: [
            buildTextField({
              id: 'heirsAdditionalInfo',
              title: m.info,
              placeholder: m.infoPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'heirsOverview',
          title: m.overview,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewNetProperty',
              title: m.netProperty,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: m.netProperty,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    (getValueViaPath<number>(answers, 'assets.assetsTotal') ||
                      0) -
                      (getValueViaPath<number>(answers, 'debts.debtsTotal') ||
                        0) +
                      (getValueViaPath<number>(
                        answers,
                        'business.businessTotal',
                      ) || 0),
                  ),
                ),
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalDeduction,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(Number(answers.totalDeduction ?? '0'))),
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.netPropertyForExchange,
              display: 'flex',
              value: ({ answers }) => {
                return formatCurrency(
                  String(
                    Number(getValueViaPath(answers, 'assets.assetsTotal')) -
                      Number(getValueViaPath(answers, 'debts.debtsTotal')) +
                      Number(
                        getValueViaPath(answers, 'business.businessTotal'),
                      ) -
                      Number(getValueViaPath(answers, 'totalDeduction') ?? '0'),
                  ),
                )
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewHeirsTitle',
              title: m.heirs,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildCustomField({
              title: '',
              id: 'overviewHeirs',
              doesNotRequireAnswer: true,
              component: 'HeirsOverview',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewTotalInheritance',
              title: m.overviewTotalInheritance,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: m.heirsInheritanceRate,
              display: 'flex',
              value: ({ answers }) =>
                String(getValueViaPath<number>(answers, 'heirs.total')),
            }),
            buildDescriptionField({
              id: 'heirs_space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.inheritanceAmount,
              display: 'flex',
              value: ({ answers }) => {
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.inheritance),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space2',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.taxFreeInheritance,
              display: 'flex',
              value: ({ answers }) => {
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.taxFreeInheritance),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space3',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.taxableInheritance,
              display: 'flex',
              value: ({ answers }) => {
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.taxableInheritance),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space4',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.inheritanceTax,
              display: 'flex',
              value: ({ answers }) => {
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.inheritanceTax),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewAdditionalInfo',
              title: m.heirAdditionalInfo,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: m.info,
              value: ({ answers }) =>
                getValueViaPath<string>(answers, 'heirsAdditionalInfo'),
            }),
            buildCustomField({
              title: '',
              id: 'overviewPrint',
              doesNotRequireAnswer: true,
              component: 'PrintScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})
