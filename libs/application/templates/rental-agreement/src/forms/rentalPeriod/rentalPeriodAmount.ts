import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildDescriptionField,
  buildCheckboxField,
  buildSelectField,
  getValueViaPath,
  buildHiddenInput,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  AnswerOptions,
  RentalAmountIndexTypes,
  RentalAmountPaymentDateOptions,
  Routes,
  TRUE,
} from '../../lib/constants'
import {
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
} from '../../lib/utils'
import { rentalAmount } from '../../lib/messages'

const rentalAmountConnectedToIndex = (answers: FormValue) => {
  const isAmountConnectedToIndex = getValueViaPath(
    answers,
    'rentalAmount.isIndexConnected',
    [],
  ) as string[]
  return isAmountConnectedToIndex && isAmountConnectedToIndex.includes(TRUE)
}

export const RentalPeriodAmount = buildSubSection({
  id: Routes.RENTALAMOUNT,
  title: rentalAmount.subSectionName,
  children: [
    buildMultiField({
      id: Routes.RENTALAMOUNT,
      title: rentalAmount.pageTitle,
      description: rentalAmount.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalAmount.detailsTitle',
          title: rentalAmount.infoTitle,
          titleVariant: 'h3',
          space: 1,
        }),

        // Monthly rental amount and indexation
        buildTextField({
          id: 'rentalAmount.amount',
          title: rentalAmount.inputLabel,
          placeholder: rentalAmount.inputPlaceholder,
          variant: 'currency',
          maxLength: 15,
          required: true,
        }),
        buildSelectField({
          id: 'rentalAmount.indexTypes',
          title: rentalAmount.indexOptionsLabel,
          options: getRentalAmountIndexTypes(),
          defaultValue: RentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
          condition: rentalAmountConnectedToIndex,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isIndexConnected',
          title: '',
          options: [
            {
              value: TRUE,
              label: rentalAmount.priceIndexLabel,
            },
          ],
          spacing: 0,
        }),

        // Payment details
        buildDescriptionField({
          id: 'rentalAmount.paymentDateDetails',
          title: rentalAmount.paymentDateTitle,
          titleVariant: 'h4',
          description: rentalAmount.paymentDateDescription,
          space: 6,
        }),
        buildSelectField({
          id: 'rentalAmount.paymentDateOptions',
          title: rentalAmount.paymentDateOptionsLabel,
          options: getRentalAmountPaymentDateOptions(),
          defaultValue: RentalAmountPaymentDateOptions.FIRST_DAY,
        }),
        buildTextField({
          id: 'rentalAmount.paymentDateOther',
          title: rentalAmount.paymentDateOtherOptionLabel,
          placeholder: rentalAmount.paymentDateOtherOptionPlaceholder,
          maxLength: 100,
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmount.paymentDateOptions') ===
            RentalAmountPaymentDateOptions.OTHER,
        }),
        buildDescriptionField({
          id: 'rentalAmount.paymentInsuranceTitle',
          title: rentalAmount.paymentInsuranceTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isPaymentInsuranceRequired',
          title: '',
          options: [
            {
              value: AnswerOptions.YES,
              label: rentalAmount.paymentInsuranceRequiredLabel,
            },
          ],
        }),
        buildHiddenInput({
          id: 'rentalAmount.paymentInsuranceDetails',
          condition: (answers) => {
            const checkbox = getValueViaPath<Array<string>>(
              answers,
              'rentalAmount.isPaymentInsuranceRequired',
            )
            return checkbox?.includes(AnswerOptions.YES) || false
          },
        }),
      ],
    }),
  ],
})
