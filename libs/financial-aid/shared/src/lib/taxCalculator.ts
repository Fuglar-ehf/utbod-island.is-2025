export const taxInfoNumbers = {
  '2021': {
    taxPercentage: 31.45,
    personalTaxAllowance: 50792,
  },
}

interface TaxInfoYear {
  [id: string]: TaxInfo
}

export interface TaxInfo {
  personalTaxAllowance: number
  taxPercentage: number
}
import format from 'date-fns/format'
import { Amount, Calculations } from './interfaces'

const currentYear = format(new Date(), 'yyyy')

export const calculateAidFinalAmount = (
  amount: number,
  usePersonalTaxAllowance: boolean,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  const personalTaxAllowance = taxInfo.personalTaxAllowance

  const tax = Math.floor(amount * taxPercentage)

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const finalTaxAmount = Math.max(tax - personalTaxAllowanceUsed, 0)

  return amount - finalTaxAmount
}

export const calculateTaxOfAmount = (amount: number): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  return Math.floor(amount * taxPercentage)
}

export const calculatePersonalTaxAllowanceUsed = (
  amount: number,
  usePersonalTaxAllowance: boolean,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const personalTaxAllowance = taxInfo.personalTaxAllowance

  const personalTaxAllowanceUsed = usePersonalTaxAllowance
    ? personalTaxAllowance
    : 0

  const tax = calculateTaxOfAmount(amount)

  // Only show the amount of used personal tax allowence, not the full tax allowence
  return Math.min(personalTaxAllowanceUsed, tax)
}

export const calculateAcceptedAidFinalAmount = (
  amount: number,
  personalTaxCreditPercentage: number,
  spousedPersonalTaxCreditPercentage: number,
): number => {
  const taxInfoYear: TaxInfoYear = taxInfoNumbers
  const taxInfo = taxInfoYear[currentYear]

  const taxPercentage = taxInfo.taxPercentage / 100

  const personalTaxAllowance = Math.floor(
    taxInfo.personalTaxAllowance * (personalTaxCreditPercentage / 100),
  )

  const spouseTaxAllowance = Math.floor(
    taxInfo.personalTaxAllowance * (spousedPersonalTaxCreditPercentage / 100),
  )

  const tax = Math.floor(amount * taxPercentage)

  const finalTaxAmount = Math.max(
    tax - personalTaxAllowance + spouseTaxAllowance,
    0,
  )

  return amount - finalTaxAmount
}

export const estimatedBreakDown = (
  aidAmount = 0,
  usePersonalTaxCredit = false,
): Calculations[] => {
  if (aidAmount === 0) {
    return []
  }

  return [
    {
      title: 'Grunnupphæð',
      calculation: `+ ${aidAmount?.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Skattur',
      calculation: `- ${calculateTaxOfAmount(aidAmount).toLocaleString(
        'de-DE',
      )} kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `${
        usePersonalTaxCredit ? '+ ' : ''
      }${calculatePersonalTaxAllowanceUsed(
        aidAmount,
        usePersonalTaxCredit,
      ).toLocaleString('de-DE')} kr. `,
    },
    {
      title: 'Áætluð aðstoð (hámark)',
      calculation: `${calculateAidFinalAmount(
        aidAmount,
        usePersonalTaxCredit,
      ).toLocaleString('de-DE')} kr.`,
    },
  ]
}

export const acceptedAmountBreakDown = (amount?: Amount): Calculations[] => {
  if (!amount) {
    return []
  }

  const deductionFactors =
    amount?.deductionFactors?.map((deductionFactor) => {
      return {
        title: deductionFactor.description ?? '',
        calculation: `- ${deductionFactor?.amount?.toLocaleString(
          'de-DE',
        )} kr.`,
      }
    }) ?? []

  const basicCalc = [
    {
      title: 'Grunnupphæð',
      calculation: `+ ${amount?.aidAmount.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Tekjur',
      calculation: amount?.income
        ? `- ${amount?.income.toLocaleString('de-DE')} kr.`
        : '0',
    },
    ...deductionFactors,
    {
      title: 'Skattur',
      calculation: `- ${amount?.tax.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `${amount?.personalTaxCredit.toLocaleString('de-DE')} kr. `,
    },
    {
      title: 'Aðstoð',
      calculation: `${amount.finalAmount.toLocaleString('de-DE')} kr.`,
    },
  ]

  return basicCalc
}
