import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  buildDateField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  getApplicationAnswers,
  getOtherFeesHousingFundPayeeOptions,
  getOtherFeesPayeeOptions,
} from '../../lib/utils'
import { OtherFeesPayeeOptions, Routes } from '../../lib/constants'
import { otherFees } from '../../lib/messages'

const housingFundAmountPayedByTenant = (answers: FormValue) => {
  const { otherFeesHousingFund } = getApplicationAnswers(answers)
  return otherFeesHousingFund === OtherFeesPayeeOptions.TENANT
}

const electricityCostPayedByTenant = (answers: FormValue) => {
  const { otherFeesElectricityCost } = getApplicationAnswers(answers)
  return otherFeesElectricityCost === OtherFeesPayeeOptions.TENANT
}

const heatingCostPayedByTenant = (answers: FormValue) => {
  const { otherFeesHeatingCost } = getApplicationAnswers(answers)
  return otherFeesHeatingCost === OtherFeesPayeeOptions.TENANT
}

export const RentalPeriodOtherFees = buildSubSection({
  id: Routes.OTHERFEES,
  title: otherFees.subSectionName,
  children: [
    buildMultiField({
      id: Routes.OTHERFEES,
      title: otherFees.pageTitle,
      description: otherFees.pageDescription,
      children: [
        buildRadioField({
          id: 'otherFees.housingFund',
          title: otherFees.housingFundTitle,
          clearOnChange: ['otherFees.housingFundAmount'],
          options: getOtherFeesHousingFundPayeeOptions,
          width: 'half',
          space: 1,
        }),
        buildTextField({
          id: 'otherFees.housingFundAmount',
          title: otherFees.housingFundAmountLabel,
          placeholder: otherFees.housingFundAmountPlaceholder,
          variant: 'currency',
          maxLength: 13,
          condition: housingFundAmountPayedByTenant,
        }),

        // Electricity cost fields
        buildRadioField({
          id: 'otherFees.electricityCost',
          title: otherFees.electricityCostTitle,
          clearOnChange: [
            'otherFees.electricityCostMeterNumber',
            'otherFees.electricityCostMeterStatus',
            'otherFees.electricityCostMeterStatusDate',
          ],
          options: getOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'otherFees.electricityCostMeterNumber',
          title: otherFees.electricityCostMeterNumberLabel,
          placeholder: otherFees.electricityCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: electricityCostPayedByTenant,
        }),
        buildTextField({
          id: 'otherFees.electricityCostMeterStatus',
          title: otherFees.electricityCostMeterStatusLabel,
          placeholder: otherFees.electricityCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: electricityCostPayedByTenant,
        }),
        buildDateField({
          id: 'otherFees.electricityCostMeterStatusDate',
          title: otherFees.electricityCostMeterStatusDateLabel,
          placeholder: otherFees.electricityCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: electricityCostPayedByTenant,
        }),

        // Heating cost fields
        buildRadioField({
          id: 'otherFees.heatingCost',
          title: otherFees.heatingCostTitle,
          clearOnChange: [
            'otherFees.heatingCostMeterNumber',
            'otherFees.heatingCostMeterStatus',
            'otherFees.heatingCostMeterStatusDate',
          ],
          options: getOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'otherFees.heatingCostMeterNumber',
          title: otherFees.heatingCostMeterNumberLabel,
          placeholder: otherFees.heatingCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: heatingCostPayedByTenant,
        }),
        buildTextField({
          id: 'otherFees.heatingCostMeterStatus',
          title: otherFees.heatingCostMeterStatusLabel,
          placeholder: otherFees.heatingCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: heatingCostPayedByTenant,
        }),
        buildDateField({
          id: 'otherFees.heatingCostMeterStatusDate',
          title: otherFees.heatingCostMeterStatusDateLabel,
          placeholder: otherFees.heatingCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: heatingCostPayedByTenant,
        }),

        // TODO: Add otherCosts fields when ready
        // Other fees
        // buildDescriptionField({
        //   id: 'otherFees.otherCostsTitle',
        //   title: otherFees.otherCostsTitle,
        //   titleVariant: 'h4',
        //   space: 6,
        // }),
        // buildCheckboxField({
        //   id: 'otherFees.otherCosts',
        //   title: '',
        //   options: [
        //     {
        //       value: TRUE,
        //       label: otherFees.otherCostsLabel,
        //     },
        //   ],
        //   spacing: 0,
        // }),
        // buildTextField({
        //   id: 'otherFees.otherCostsDescription',
        //   title: otherFees.otherCostsDescriptionLabel,
        //   placeholder: otherFees.otherCostsDescriptionPlaceholder,
        //   width: 'half',
        //   condition: (answers) => {
        //     const otherFeesOtherCosts = getValueViaPath(
        //       answers,
        //       'otherFees.otherCosts',
        //       [],
        //     ) as string[]
        //     return (
        //       otherFeesOtherCosts && otherFeesOtherCosts.includes(TRUE)
        //     )
        //   },
        // }),
        // buildTextField({
        //   id: 'otherFees.otherCostsAmount',
        //   title: otherFees.otherCostsAmountLabel,
        //   placeholder: otherFees.otherCostsAmountPlaceholder,
        //   width: 'half',
        //   condition: (answers) => {
        //     const otherFeesOtherCosts = getValueViaPath(
        //       answers,
        //       'otherFees.otherCosts',
        //       [],
        //     ) as string[]
        //     return (
        //       otherFeesOtherCosts && otherFeesOtherCosts.includes(TRUE)
        //     )
        //   },
        // }),
      ],
    }),
  ],
})
