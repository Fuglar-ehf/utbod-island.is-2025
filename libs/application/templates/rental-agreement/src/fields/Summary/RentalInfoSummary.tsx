import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SummaryCard } from './components/SummaryCard'
import { SummaryCardRow } from './components/SummaryCardRow'
import { KeyValue } from './components/KeyValue'
import { RentalAgreement } from '../../lib/dataSchema'
import {
  AnswerOptions,
  Routes,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
  TRUE,
} from '../../lib/constants'
import {
  formatCurrency,
  formatDate,
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
  getSecurityAmountOptions,
  getSecurityDepositTypeOptions,
} from '../../lib/utils'
import { summary } from '../../lib/messages'

type Props = {
  answers: RentalAgreement
  goToScreen?: (id: string) => void
  rentalPeriodRoute?: Routes
  rentalAmountRoute?: Routes
  securityDepositRoute?: Routes
}

export const RentalInfoSummary = ({
  answers,
  goToScreen,
  rentalAmountRoute,
  rentalPeriodRoute,
  securityDepositRoute,
}: Props) => {
  const { formatMessage } = useLocale()

  const isSecurityDepositRequired =
    answers.rentalAmount.isPaymentInsuranceRequired?.includes(AnswerOptions.YES)
  const isSecurityDepositAmount =
    answers.securityDeposit?.securityAmount ||
    answers.securityDeposit?.securityAmountOther
  const isSecurityDepositType = answers.securityDeposit?.securityType

  const securityDepositType = (answer: string) => {
    const options = getSecurityDepositTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const paymentDate = (answer: string) => {
    const options = getRentalAmountPaymentDateOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const indexType = (answer: string) => {
    const options = getRentalAmountIndexTypes()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const securityDepositAmount = (answer: string | undefined) => {
    const options = getSecurityAmountOptions()
    const rentalAmount = Number(answers.rentalAmount.amount)
    const matchingOption = options.find((option) => option.value === answer)

    if (!matchingOption) {
      return '-'
    }

    switch (matchingOption.value) {
      case SecurityDepositAmountOptions.ONE_MONTH:
        return formatCurrency(answers.rentalAmount.amount)
      case SecurityDepositAmountOptions.TWO_MONTHS:
        return formatCurrency((rentalAmount * 2).toString())
      case SecurityDepositAmountOptions.THREE_MONTHS:
        return formatCurrency((rentalAmount * 3).toString())
      case SecurityDepositAmountOptions.OTHER:
        return answers.securityDeposit.securityAmountOther
          ? formatCurrency(answers.securityDeposit.securityAmountOther)
          : '-'
      default:
        return '-'
    }
  }

  return (
    <SummaryCard>
      {/* Property Address */}
      <SummaryCardRow isChangeButton={false}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={`${answers.registerProperty.address}, ${answers.registerProperty.municipality}`}
            value={
              `${formatMessage(summary.rentalPropertyIdPrefix)}${
                answers.registerProperty.propertyId
              }` || '-'
            }
            labelVariant="h4"
            labelAs="h4"
            valueVariant="medium"
            valueAs="p"
          />
        </GridColumn>
      </SummaryCardRow>

      {/* Rental period */}
      <SummaryCardRow editAction={goToScreen} route={rentalPeriodRoute}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.rentalPeriodStartDateLabel}
            value={
              (answers.rentalPeriod.startDate &&
                formatDate(answers.rentalPeriod.startDate.toString())) ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={
              answers.rentalPeriod.isDefinite?.includes('true')
                ? summary.rentalPeriodEndDateLabel
                : summary.rentalPeriodDefiniteLabel
            }
            value={
              answers.rentalPeriod.isDefinite?.includes('true') &&
              answers.rentalPeriod.endDate
                ? formatDate(answers.rentalPeriod.endDate.toString())
                : summary.rentalPeriodDefiniteValue
            }
          />
        </GridColumn>
      </SummaryCardRow>

      {/* Rental amount */}
      <SummaryCardRow editAction={goToScreen} route={rentalAmountRoute}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.rentalAmountLabel}
            value={formatCurrency(answers.rentalAmount.amount) || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.paymentDateOptionsLabel}
            value={
              paymentDate(answers.rentalAmount.paymentDateOptions as string) ||
              '-'
            }
          />
        </GridColumn>
        {answers.rentalAmount.isIndexConnected?.includes(TRUE) &&
          answers.rentalAmount.indexTypes && (
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.indexTypeLabel}
                value={indexType(answers.rentalAmount.indexTypes) || '-'}
              />
            </GridColumn>
          )}
      </SummaryCardRow>

      {/* Security deposit */}
      {isSecurityDepositRequired && (
        <SummaryCardRow editAction={goToScreen} route={securityDepositRoute}>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityDepositLabel}
              value={
                isSecurityDepositAmount
                  ? securityDepositAmount(
                      answers.securityDeposit.securityAmount,
                    )
                  : '-'
              }
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityTypeLabel}
              value={
                isSecurityDepositType
                  ? securityDepositType(
                      answers.securityDeposit.securityType as string,
                    )
                  : '-'
              }
            />
          </GridColumn>
          {answers.securityDeposit.securityType !==
            SecurityDepositTypeOptions.CAPITAL && (
            <GridColumn span={['12/12', '4/12']}>
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.BANK_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeInstitutionLabel}
                  value={answers.securityDeposit.bankGuaranteeInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeThirdPartyGuaranteeLabel}
                  value={answers.securityDeposit.thirdPartyGuaranteeInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.INSURANCE_COMPANY && (
                <KeyValue
                  label={summary.securityTypeInsuranceLabel}
                  value={answers.securityDeposit.insuranceCompanyInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.MUTUAL_FUND && (
                <KeyValue
                  label={summary.securityTypeMutualFundLabel}
                  value={answers.securityDeposit.mutualFundInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.OTHER && (
                <KeyValue
                  label={summary.securityTypeOtherLabel}
                  value={answers.securityDeposit.otherInfo || '-'}
                />
              )}
            </GridColumn>
          )}
        </SummaryCardRow>
      )}
    </SummaryCard>
  )
}
