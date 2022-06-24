import formatISO from 'date-fns/formatISO'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import setSeconds from 'date-fns/setSeconds'

import { validate } from './validate'

export const parseTime = (date: string, time: string) => {
  const timeWithoutColon = time.replace(':', '')
  const hours = timeWithoutColon.slice(0, 2)
  const minutes = timeWithoutColon.slice(2, 4)
  const isValidTime = validate([[time, ['empty', 'time-format']]]).isValid

  const dateHours = setHours(new Date(date), parseInt(hours))

  /**
   * We are not validating date because we are assuming the date can't be invalid.
   * The user can't input the date by hand and can't input the time before selecting
   * a date.
   * */
  if (isValidTime) {
    const dateMinutes = formatISO(
      setSeconds(setMinutes(dateHours, parseInt(minutes)), 0),
    )

    return dateMinutes
  } else {
    return date.indexOf('T') > -1 ? date.substring(0, date.indexOf('T')) : date
  }
}

// Credit: https://stackoverflow.com/a/53060314
export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const replaceTabs = (str: string) =>
  str?.replace(/(?: \t+|\t+ |\t+)/g, ' ')

export const replaceTabsOnChange = (
  evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  if (evt.target.value.includes('\t')) {
    evt.target.value = replaceTabs(evt.target.value)
  }
}

/**
 * Given a time with a single hour digit, f.x. 1:15, returns
 * a zero padded value, i.e. 01:15.
 * @param time value to pad with zero
 */
export const padTimeWithZero = (time: string): string => {
  const threeDigitRegex = new RegExp(/^([0-9])(:[0-5]\d)/)
  return threeDigitRegex.test(time) ? time.padStart(5, '0') : time
}
/**
 * Enumerates a list of string, f.x
 * enumerate(['alice', 'bob', 'paul'], 'and'), returns "alice, bob and paul"
 * @param values list of strings to enumerate
 * @param endWord the word before last value is enumerated
 */
export const enumerate = (values: string[], endWord: string): string => {
  return values.join(', ').replace(/, ([^,]*)$/, ` ${endWord} $1`)
}
