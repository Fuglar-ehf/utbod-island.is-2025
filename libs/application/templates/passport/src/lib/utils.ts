import {
  ExternalData,
  FormValue,
  PaymentCatalogItem,
} from '@island.is/application/types'
import {
  IdentityDocumentData,
  PASSPORT_CHARGE_CODES,
  Passport,
  PersonalInfo,
  Service,
  Services,
} from './constants'
import { getValueViaPath } from '@island.is/application/core'

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChildPassport = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  return (externalData.identityDocument
    ?.data as IdentityDocumentData)?.childPassports.find((child) => {
    return (
      child.childNationalId === (answers.passport as Passport)?.childPassport
    )
  })
}
export const hasSecondGuardian = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const child = getChildPassport(answers, externalData)
  return !!child?.secondParent
}

export const hasDiscount = (answers: FormValue, externalData: ExternalData) => {
  const isChildPassport = (answers.passport as Passport)?.childPassport !== ''
  const hasDisabilityDiscount =
    (answers.passport as Passport)?.userPassport !== '' &&
    (answers.personalInfo as PersonalInfo)?.hasDisabilityDiscountChecked
  const age = (externalData.nationalRegistry?.data as {
    age?: number
  })?.age
  const isElder = age ? age >= 67 : false
  return hasDisabilityDiscount || isChildPassport || isElder
}

export const getChargeCode = (
  answers: FormValue,
  externalData: ExternalData,
  type?: string,
): string => {
  const withDiscount = hasDiscount(answers, externalData)

  const serviceType = type ? type : (answers.service as Service).type

  const chargeCode = withDiscount
    ? serviceType === Services.REGULAR
      ? PASSPORT_CHARGE_CODES.DISCOUNT_REGULAR
      : PASSPORT_CHARGE_CODES.DISCOUNT_EXPRESS
    : serviceType === Services.REGULAR
    ? PASSPORT_CHARGE_CODES.REGULAR
    : PASSPORT_CHARGE_CODES.EXPRESS

  return chargeCode
}

export const getPrice = (
  externalData: ExternalData,
  chargeCode: string,
): string => {
  const chargeItems = getValueViaPath(
    externalData,
    'payment.data',
  ) as PaymentCatalogItem[]

  const chargeItem = chargeItems.find(
    (item) => item.chargeItemCode === chargeCode,
  )

  return getCurrencyString(chargeItem?.priceAmount || 0)
}
