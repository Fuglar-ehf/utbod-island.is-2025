import { format, parseISO, isValid } from 'date-fns' // eslint-disable-line no-restricted-imports
// Importing 'is' directly from date-fns/locale/is has caused unexpected problems
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports

import {
  CaseCustodyRestrictions,
  CaseGender,
} from '@island.is/judicial-system/types'

const getAsDate = (date: Date | string | undefined | null): Date => {
  if (typeof date === 'string' || date instanceof String) {
    return parseISO(date as string)
  } else {
    return date as Date
  }
}

export function formatDate(
  date: Date | string | undefined,
  formatPattern: string,
  shortenDayName?: boolean,
): string | undefined {
  const theDate: Date = getAsDate(date)

  if (isValid(theDate)) {
    const formattedDate = format(theDate, formatPattern, {
      locale: is,
    })

    if (shortenDayName) {
      return formattedDate.replace('dagur,', 'd.')
    } else {
      return formattedDate
    }
  } else {
    return undefined
  }
}

// Credit: https://dzone.com/articles/capitalize-first-letter-string-javascript
export const capitalize = (text: string): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatNationalId = (nationalId: string): string => {
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const laws = {
  _95_1_A: 'a-lið 1. mgr. 95. gr.',
  _95_1_B: 'b-lið 1. mgr. 95. gr.',
  _95_1_C: 'c-lið 1. mgr. 95. gr.',
  _95_1_D: 'd-lið 1. mgr. 95. gr.',
  _95_2: '2. mgr. 95. gr.',
  _99_1_B: 'b-lið 1. mgr. 99. gr.',
  _100_1: '1. mgr. 100. gr. sml.',
}

const getRestrictionByValue = (value: CaseCustodyRestrictions) => {
  switch (value) {
    case CaseCustodyRestrictions.COMMUNICATION:
      return 'D - Bréfskoðun, símabann'
    case CaseCustodyRestrictions.ISOLATION:
      return 'B - Einangrun'
    case CaseCustodyRestrictions.MEDIA:
      return 'E - Fjölmiðlabann'
    case CaseCustodyRestrictions.VISITAION:
      return 'C - Heimsóknarbann'
  }
}

export const getShortRestrictionByValue = (value: CaseCustodyRestrictions) => {
  switch (value) {
    case CaseCustodyRestrictions.COMMUNICATION:
      return 'Bréfskoðun, símabann'
    case CaseCustodyRestrictions.ISOLATION:
      return 'Einangrun'
    case CaseCustodyRestrictions.MEDIA:
      return 'Fjölmiðlabann'
    case CaseCustodyRestrictions.VISITAION:
      return 'Heimsóknarbann'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION:
      return 'Tilkynningarskylda'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT:
      return 'Afhending vegabréfs'
  }
}

export enum NounCases {
  NOMINATIVE, // Nefnifall
  ACCUSATIVE, // Þolfall
  DATIVE, // Þágufall
  GENITIVE, // Eignarfall
}

export function formatAccusedByGender(
  accusedGender: CaseGender,
  nounCase: NounCases = NounCases.NOMINATIVE,
) {
  switch (accusedGender) {
    case CaseGender.MALE:
      return nounCase === NounCases.NOMINATIVE ? 'kærði' : 'kærða'
    case CaseGender.FEMALE:
      return nounCase === NounCases.NOMINATIVE ? 'kærða' : 'kærðu'
    default:
      return 'kærða'
  }
}

export function formatCustodyRestrictions(
  accusedGender: CaseGender,
  custodyRestrictions: CaseCustodyRestrictions[],
): string {
  const relevantCustodyRestrictions = custodyRestrictions?.filter(
    (restriction) =>
      [
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.MEDIA,
      ].includes(restriction),
  )

  if (!(relevantCustodyRestrictions?.length > 0)) {
    return 'Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.'
  }

  let res = 'Sækjandi tekur fram að '

  if (relevantCustodyRestrictions.includes(CaseCustodyRestrictions.ISOLATION)) {
    res += `${formatAccusedByGender(
      accusedGender,
    )} skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur`

    if (relevantCustodyRestrictions.length === 1) {
      return res + '.'
    }

    res += ' og að '
  }

  const filteredCustodyRestrictions = relevantCustodyRestrictions
    .filter(
      (custodyRestriction) =>
        custodyRestriction !== CaseCustodyRestrictions.ISOLATION,
    )
    .sort()

  const filteredCustodyRestrictionsAsString = filteredCustodyRestrictions.reduce(
    (res, custodyRestriction, index) => {
      const isNextLast = index === filteredCustodyRestrictions.length - 2
      const isLast = index === filteredCustodyRestrictions.length - 1
      const isOnly = filteredCustodyRestrictions.length === 1

      return (res +=
        custodyRestriction === CaseCustodyRestrictions.COMMUNICATION
          ? `bréfaskoðun og símabanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : custodyRestriction === CaseCustodyRestrictions.MEDIA
          ? `fjölmiðlabanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : custodyRestriction === CaseCustodyRestrictions.VISITAION
          ? `heimsóknarbanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : '')
    },
    '',
  )

  return `${res}gæsluvarðhaldið verði með ${filteredCustodyRestrictionsAsString}skv. 99. gr. laga nr. 88/2008.`
}

export const formatAlternativeTravelBanRestrictions = (
  accusedGender: CaseGender,
  custodyRestrictions: CaseCustodyRestrictions[],
): string => {
  const relevantCustodyRestrictions = custodyRestrictions?.filter(
    (restriction) =>
      [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
      ].includes(restriction),
  )

  if (!(relevantCustodyRestrictions?.length > 0)) {
    return 'Sækjandi tekur fram að farbannið sé án takmarkana.'
  }

  const accusedGenderText = formatAccusedByGender(
    accusedGender,
    NounCases.DATIVE,
  )
  const alternativeTravelBanRequireNotificationText = relevantCustodyRestrictions.includes(
    CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
  )
    ? ` Að ${accusedGenderText} verði gert að tilkynna sig.`
    : ''
  const alternativeTravelBanConfiscatePassportText = relevantCustodyRestrictions.includes(
    CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
  )
    ? ` Að ${accusedGenderText} verði gert að afhenda vegabréfið sitt.`
    : ''

  return `Sækjandi tekur fram að farbannið verði með takmörkunum.${alternativeTravelBanRequireNotificationText}${alternativeTravelBanConfiscatePassportText}`
}

export const formatRequestedCustodyRestrictions = (
  restrictions?: CaseCustodyRestrictions[],
) => {
  return restrictions && restrictions.length > 0
    ? restrictions
        .map((restriction) => getRestrictionByValue(restriction))
        .toString()
        .replace(',', ', ')
    : 'Ekki er farið fram á takmarkanir á gæslu'
}

export function formatGender(gender: CaseGender): string {
  switch (gender) {
    case CaseGender.MALE:
      return 'Karl'
    case CaseGender.FEMALE:
      return 'Kona'
    case CaseGender.OTHER:
      return 'Kynsegin/Annað'
  }
}
