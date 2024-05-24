import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  formatBankInfo,
  formatCurrency,
} from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'

import { m } from '../../lib/messages'
import {
  ClaimsData,
  EstateAssets,
  OtherAssetsData,
  StocksData,
} from '../../types'
import {
  hasYes,
  shouldShowDeceasedShareField,
  valueToNumber,
} from '../../lib/utils/helpers'

export const overviewAssets = [
  buildDescriptionField({
    id: 'overviewRealEstate',
    title: m.realEstate,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const realEstateAssets = (answers.assets as unknown as EstateAssets)
          ?.realEstate?.data

        return (realEstateAssets ?? []).map((asset) => {
          const propertyValuation = parseFloat(asset.propertyValuation)
          const propertyShare = parseFloat(asset.share)

          const description = [
            `${m.assetNumber.defaultMessage}: ${asset.assetNumber}`,
            m.realEstateEstimation.defaultMessage +
              ': ' +
              (propertyValuation
                ? formatCurrency(String(propertyValuation))
                : '0 kr.'),
            m.propertyShare.defaultMessage + `: ${propertyShare}%`,
          ]

          const deceasedShare = valueToNumber(asset.deceasedShare)

          if (hasYes(asset.deceasedShareEnabled)) {
            description.push(
              m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
            )
          }

          return {
            title: asset.description,
            description,
          }
        })
      },
    },
  ),
  buildKeyValueField({
    label: m.realEstateEstimation,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.realEstate.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewVehicles',
    title: m.vehicles,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: (application: Application) => {
        const answers = application.answers
        const vehicleAssets = (answers.assets as unknown as EstateAssets)
          .vehicles.data
        return (
          vehicleAssets.map((asset) => {
            const description = [
              `${m.vehicleNumberLabel.defaultMessage}: ${asset.assetNumber}`,
              m.vehicleValuation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ]

            const deceasedShare = valueToNumber(asset.deceasedShare)

            if (hasYes(asset.deceasedShareEnabled)) {
              description.push(
                m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
              )
            }

            return {
              title: asset.description,
              description,
            }
          }) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.vehicles.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewGuns',
    title: m.guns,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const gunAssets = (answers.assets as unknown as EstateAssets).guns.data
        return (
          gunAssets.map((asset) => {
            const description = [
              `${m.gunSerialNumber.defaultMessage}: ${asset.assetNumber}`,
              m.gunValuation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ]

            const deceasedShare = valueToNumber(asset.deceasedShare)

            if (hasYes(asset.deceasedShareEnabled)) {
              description.push(
                m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
              )
            }

            return {
              title: asset.description,
              description,
            }
          }) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.guns.total')
      return total ? formatCurrency(String(total)) : '0 kr.'
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewInventory',
    title: m.inventoryTitle,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'overviewInventory',
    title: m.inventoryTextField,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'assets.inventory.info'),
    titleVariant: 'h4',
    space: 'gutter',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'assets.inventory.info') !== '',
  }),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.inventory.value')
      return formatCurrency(String(total))
    },
  }),
  buildKeyValueField({
    label: m.deceasedShare,
    display: 'flex',
    condition: shouldShowDeceasedShareField,
    value: ({ answers }) => {
      const deceasedShare = getValueViaPath(
        answers,
        'assets.inventory.deceasedShare',
      )
      return `${deceasedShare}%`
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewBanks',
    title: m.estateBankInfo,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        (
          (answers.assets as unknown as EstateAssets).bankAccounts.data ?? []
        ).map((account) => {
          const isForeign = account.foreignBankAccount?.length

          const description = [
            `${m.bankAccountCapital.defaultMessage}: ${formatCurrency(
              String(valueToNumber(account.propertyValuation)),
            )}`,
            `${
              m.bankAccountPenaltyInterestRates.defaultMessage
            }: ${formatCurrency(
              String(valueToNumber(account.exchangeRateOrInterest)),
            )}`,
            `${m.bankAccountForeign.defaultMessage}: ${
              isForeign ? m.yes.defaultMessage : m.no.defaultMessage
            }`,
          ]

          const deceasedShare = valueToNumber(account.deceasedShare)

          if (hasYes(account.deceasedShareEnabled)) {
            description.push(
              m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
            )
          }

          return {
            titleRequired: false,
            title: isForeign
              ? account.assetNumber
              : formatBankInfo(account.assetNumber ?? ''),
            description,
          }
        }),
    },
  ),
  buildKeyValueField({
    label: m.banksBalance,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.bankAccounts.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewClaims',
    title: m.claimsTitle,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const claims = (answers.assets as unknown as EstateAssets).claims.data
        return (
          claims.map((asset: ClaimsData) => {
            const description = [
              m.claimsAmount.defaultMessage +
                ': ' +
                (asset.value ? formatCurrency(asset.value) : '0 kr.'),
            ]

            const deceasedShare = valueToNumber(asset.deceasedShare)

            if (hasYes(asset.deceasedShareEnabled)) {
              description.push(
                m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
              )
            }

            return {
              title: asset.description,
              titleRequired: false,
              description,
            }
          }) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.totalValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.claims.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewStocks',
    title: m.stocksTitle,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const stocks = (answers.assets as unknown as EstateAssets).stocks.data
        return (
          stocks.map((stock: StocksData) => {
            const description = [
              `${m.stocksNationalId.defaultMessage}: ${formatNationalId(
                stock.nationalId ?? '',
              )}`,
              `${m.stocksFaceValue.defaultMessage}: ${formatCurrency(
                stock.amount ?? '0',
              )}`,
              `${m.stocksRateOfChange.defaultMessage}: ${
                stock.exchangeRateOrInterest?.replace('.', ',') ?? '0'
              }`,
              `${m.stocksValue.defaultMessage}: ${formatCurrency(
                stock.value ?? '0',
              )}`,
            ]

            const deceasedShare = valueToNumber(stock.deceasedShare)

            if (hasYes(stock.deceasedShareEnabled)) {
              description.push(
                m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
              )
            }

            return {
              title: stock.organization,
              titleRequired: false,
              description,
            }
          }) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.totalValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.stocks.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewMoney',
    title: m.moneyTitle,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'moneyInfo',
    title: m.moneyText,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'assets.money.info'),
    titleVariant: 'h4',
    space: 'gutter',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'assets.money.info') !== '',
  }),
  buildKeyValueField({
    label: m.totalValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.money.value')
      return formatCurrency(String(total))
    },
  }),
  buildKeyValueField({
    label: m.deceasedShare,
    display: 'flex',
    condition: shouldShowDeceasedShareField,
    value: ({ answers }) => {
      const deceasedShare = getValueViaPath(
        answers,
        'assets.money.deceasedShare',
      )
      return `${deceasedShare}%`
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewOtherAssets',
    title: m.otherAssetsTitle,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'otherAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const otherAssets = (answers.assets as unknown as EstateAssets)
          .otherAssets.data
        return (
          otherAssets.map((otherAsset: OtherAssetsData) => {
            const description = [
              `${m.otherAssetsValue.defaultMessage}: ${formatCurrency(
                otherAsset.value ?? '0',
              )}`,
            ]

            const deceasedShare = valueToNumber(otherAsset.deceasedShare)

            if (hasYes(otherAsset.deceasedShareEnabled)) {
              description.push(
                m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
              )
            }

            return {
              title: otherAsset.info,
              description,
            }
          }) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.totalValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.otherAssets.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildCustomField({
    title: '',
    id: 'assets.assetsTotal',
    doesNotRequireAnswer: true,
    component: 'CalculateTotalAssets',
  }),
]
