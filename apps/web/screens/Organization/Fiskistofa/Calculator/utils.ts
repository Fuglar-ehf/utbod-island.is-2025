export const getCurrentYear = () => {
  const today = new Date()
  let currentYear = today.getFullYear()

  // A new time period starts at 01.09.2022
  const newTimePeriodHasStarted = today.getMonth() >= 8

  if (newTimePeriodHasStarted) {
    currentYear += 1
  }
  return currentYear
}

export interface YearOption {
  label: string
  value: string
}

export const getYearOptions = () => {
  const years: YearOption[] = []

  const currentYear = getCurrentYear()

  for (let year = 2001; year < currentYear; year += 1) {
    const yearString = String(year)
    years.push({
      label: yearString,
      value: yearString,
    })
  }

  return years.reverse()
}

export interface TimePeriodOption {
  label: string
  value: string
}

export const generateTimePeriodOptions = () => {
  const timePeriods: TimePeriodOption[] = []

  let currentYear = getCurrentYear()

  for (let year = 2000; year < currentYear; year += 1) {
    const yearString = String(year)
    const lastTwoDigits = yearString.slice(yearString.length - 2)

    let lastTwoDigitsPlusOne = String(Number(lastTwoDigits) + 1)

    if (lastTwoDigitsPlusOne.length === 1) {
      lastTwoDigitsPlusOne = '0' + lastTwoDigitsPlusOne
    }

    timePeriods.push({
      label: `${lastTwoDigits}/${lastTwoDigitsPlusOne}`,
      value: `${lastTwoDigits}${lastTwoDigitsPlusOne}`,
    })
  }

  return timePeriods.reverse()
}
