import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}

export const isDateOlderThanAYear = (answers: FormValue) => {
  const aYearAgo = getDateAYearBack()
  const date = getValueViaPath(
    answers,
    'accidentDetails.dateOfAccident',
  ) as string
  return !!date && new Date(date).getTime() < aYearAgo.getTime()
}
