import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { overviewAssets } from '../OverviewSections/OverviewAssets'

export const assets = buildSection({
  id: 'estateProperties',
  title: m.properties,
  children: [
    buildSubSection({
      id: 'realEstate',
      title: m.realEstate,
      children: [
        buildMultiField({
          id: 'realEstate',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutAssests.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'realEstateTitle',
              title: m.realEstate,
              description: m.realEstateDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.realEstate.total',
              title: '',
            }),
            buildDescriptionField({
              id: 'assets.realEstate.hasModified',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.realEstate.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
                childInputIds: [
                  'assets.realEstate',
                  'assets.realEstate.hasModified',
                ],
              },
              {
                fields: [
                  {
                    title: m.assetNumber.defaultMessage,
                    id: 'assetNumber',
                  },
                  {
                    title: m.assetAddress.defaultMessage,
                    id: 'description',
                  },
                  {
                    title: m.propertyShare.defaultMessage,
                    id: 'propertyShare',
                  },
                  {
                    title: m.propertyValuation.defaultMessage,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                calcWithShareValue: true,
                repeaterButtonText: m.addRealEstate.defaultMessage,
                fromExternalData: 'assets',
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'inventory',
      title: m.inventoryTitle,
      children: [
        buildMultiField({
          id: 'inventory',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutInnventory.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'inventoryTitle',
              title: m.inventoryTitle,
              description: m.inventoryDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildTextField({
              id: 'assets.inventory.info',
              title: m.inventoryTextField,
              placeholder: m.inventoryTextField,
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'assets.inventory.value',
              title: m.inventoryValueTitle,
              width: 'half',
              variant: 'currency',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'assets.vehicles',
      title: m.vehicles,
      children: [
        buildMultiField({
          id: 'vehicles',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutVehicles.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'vehiclesTitle',
              title: m.vehicles,
              description: m.vehiclesDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.vehicles.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.vehicles.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.vehicleNumberLabel.defaultMessage,
                    id: 'assetNumber',
                  },
                  {
                    title: m.vehicleType.defaultMessage,
                    id: 'description',
                  },
                  {
                    title: m.vehicleValuation.defaultMessage,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.addVehicle.defaultMessage,
                fromExternalData: 'vehicles',
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'assets.guns',
      title: m.guns,
      children: [
        buildMultiField({
          id: 'guns',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutGuns.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'gunsTitle',
              title: m.guns,
              description: m.gunsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.guns.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.guns.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.gunNumber.defaultMessage,
                    id: 'assetNumber',
                  },
                  {
                    title: m.gunType.defaultMessage,
                    id: 'description',
                  },
                  {
                    title: m.gunValuation.defaultMessage,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.addGun.defaultMessage,
                fromExternalData: 'guns',
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'estateBankInfo',
      title: m.estateBankInfo,
      children: [
        buildMultiField({
          id: 'estateBankInfo',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutBankAccounts.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'estateBankInfoTitle',
              title: m.estateBankInfo,
              description: m.estateBankInfoDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.bankAccounts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.bankAccounts.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.bankAccount.defaultMessage,
                    id: 'accountNumber',
                  },
                  {
                    title: m.bankAccountBalance.defaultMessage,
                    id: 'balance',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.bankAccountRepeaterButton.defaultMessage,
                sumField: 'balance',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'claims',
      title: m.claimsTitle,
      children: [
        buildMultiField({
          id: 'claims',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutClaims.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'claimsTitle',
              title: m.claimsTitle,
              description: m.claimsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.claims.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.claims.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.claimsIssuer.defaultMessage,
                    id: 'issuer',
                  },
                  {
                    title: m.nationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.claimsAmount.defaultMessage,
                    id: 'value',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.claimsRepeaterButton.defaultMessage,
                sumField: 'value',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'stocks',
      title: m.stocksTitle,
      children: [
        buildMultiField({
          id: 'stocks',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutStocks.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'stocksTitle',
              title: m.stocksTitle,
              description: m.stocksDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.stocks.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.stocks.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.stocksOrganization.defaultMessage,
                    id: 'organization',
                  },
                  {
                    title: m.stocksNationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.stocksFaceValue.defaultMessage,
                    id: 'faceValue',
                    type: 'number',
                  },
                  {
                    title: m.stocksRateOfChange.defaultMessage,
                    id: 'rateOfExchange',
                    type: 'number',
                  },
                  {
                    title: m.stocksValue.defaultMessage,
                    id: 'value',
                    color: 'white',
                    readOnly: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.stocksRepeaterButton.defaultMessage,
                sumField: 'value',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'money',
      title: m.moneyTitle,
      children: [
        buildMultiField({
          id: 'money',
          title: m.propertiesTitle,
          description: m.propertiesDescription,
          children: [
            buildDescriptionField({
              id: 'moneyTitle',
              title: m.moneyTitle,
              description: m.moneyDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildTextField({
              id: 'assets.money.info',
              title: m.moneyText,
              placeholder: m.moneyPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'assets.money.value',
              title: m.moneyValue,
              width: 'half',
              variant: 'currency',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'otherAssets',
      title: m.otherAssetsTitle,
      children: [
        buildMultiField({
          id: 'otherAssets',
          title: m.propertiesTitle,
          description: m.propertiesDescription,
          children: [
            buildDescriptionField({
              id: 'otherAssetsTitle',
              title: m.otherAssetsTitle,
              description: m.otherAssetsDescription,
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'assets.otherAssets.info',
              title: m.otherAssetsText,
              placeholder: m.otherAssetsPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'assets.otherAssets.value',
              title: m.otherAssetsValue,
              width: 'half',
              variant: 'currency',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'assetOverview',
      title: m.assetOverview,
      children: [
        buildMultiField({
          id: 'assetOverview',
          title: m.assetOverview,
          description: m.assetOverviewDescription,
          children: [...overviewAssets],
        }),
      ],
    }),
  ],
})
