import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { EstateTypes } from './constants'
import { m } from './messages'
import { Application, FormValue } from '@island.is/application/types'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i

export const isValidEmail = (value: string) => emailRegex.test(value)

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const customZodError = (
  zodValidation: ZodTypeAny,
  errorMessage: MessageDescriptor,
): ZodTypeAny => {
  if (zodValidation._def.checks) {
    for (const check of zodValidation._def.checks) {
      check['params'] = errorMessage
      check['code'] = 'custom_error'
    }
  }
  return zodValidation
}

export function isEstateInfo(
  data: string | number | boolean | object | undefined,
): data is { estate: EstateInfo } {
  return (data as { estate: EstateInfo })?.estate?.nameOfDeceased !== undefined
}

export const isValidString = (string: string | undefined) =>
  string && /\S/.test(string)

export const isNumericalString = (string: string | undefined) =>
  string && /^[0-9]+$|^[0-9][0-9,.]+[0-9]$/.test(string)

export const getAssetDescriptionText = (
  application: Application<FormValue>,
) => {
  return application.answers.selectedEstate === EstateTypes.estateWithoutAssets
    ? /* EIGNALAUST DÁNARBU */
      m.propertiesDescriptionEstateWithoutAssets
    : application.answers.selectedEstate === EstateTypes.officialDivision
    ? /* OPINBER SKIPTI */
      m.propertiesDescriptionOfficialDivision
    : application.answers.selectedEstate ===
      EstateTypes.permitForUndividedEstate
    ? /* SETA Í ÓSKIPTU BÚI */
      m.propertiesDescriptionUndividedEstate
    : /* EINKASKIPTI */
      m.propertiesDescriptionDivisionOfEstateByHeirs
}

export const getWillsAndAgreementsDescriptionText = (
  application: Application<FormValue>,
) => {
  return application.answers.selectedEstate === EstateTypes.estateWithoutAssets
    ? /* EIGNALAUST DÁNARBU */
      m.willsAndAgreementsDescriptionEstateWithoutAssets
    : application.answers.selectedEstate === EstateTypes.officialDivision
    ? /* OPINBER SKIPTI */
      m.willsAndAgreementsDescriptionOfficialDivision
    : application.answers.selectedEstate ===
      EstateTypes.permitForUndividedEstate
    ? /* SETA Í ÓSKIPTU BÚI */
      m.willsAndAgreementsDescriptionDescriptionUndividedEstate
    : /* EINKASKIPTI */
      m.willsAndAgreementsDescriptionDivisionOfEstateByHeirs
}

export const getEstateMembersDescriptionText = (
  application: Application<FormValue>,
) => {
  return application.answers.selectedEstate === EstateTypes.estateWithoutAssets
    ? /* EIGNALAUST DÁNARBU */
      m.estateMembersDescriptionEstateWithoutAssets
    : application.answers.selectedEstate === EstateTypes.officialDivision
    ? /* OPINBER SKIPTI */
      m.estateMembersDescriptionOfficialDivision
    : application.answers.selectedEstate ===
      EstateTypes.permitForUndividedEstate
    ? /* SETA Í ÓSKIPTU BÚI */
      m.estateMembersDescriptionUndividedEstate
    : /* EINKASKIPTI */
      m.estateMembersDescriptionDivisionOfEstateByHeirs
}

export const customCurrencyFormat = (input: number | string): string => {
  if (typeof input === 'number') {
    return `${input.toLocaleString('de-DE')} kr.`
  } else if (typeof input === 'string') {
    const decimal = getDecimal(input)

    switch (decimal) {
      case ',':
        return `${Number(input.replace(decimal, '.')).toLocaleString(
          'de-DE',
        )} kr.`
      case '.':
        return `${Number(input).toLocaleString('de-DE')} kr.`
      default:
        break
    }
  }

  return `${input} kr.`
}

const getDecimal = (input: string): false | string => {
  const decimalCount = (input.match(/,/g) || []).length
  const periodCount = (input.match(/\./g) || []).length

  if (decimalCount === 1 && periodCount === 0) {
    return ','
  }

  if (decimalCount === 0 && periodCount === 1) {
    return '.'
  }

  return false
}
