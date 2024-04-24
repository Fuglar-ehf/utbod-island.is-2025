import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { StringOption as Option } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import {
  OfficialJournalOfIcelandAdvertCategory,
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandAdvertMainCategory,
  OfficialJournalOfIcelandAdvertType,
} from '@island.is/web/graphql/schema'

export const splitArrayIntoGroups = <T>(array: Array<T>, groupSize: number) => {
  return Array.from({ length: Math.ceil(array.length / groupSize) }, (_, i) =>
    array.slice(i * groupSize, (i + 1) * groupSize),
  )
}

export const removeEmptyFromObject = (obj: Record<string, string>) => {
  return Object.entries(obj)
    .filter(([_, v]) => !!v)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}

export const emptyOption = (label?: string): Option => ({
  label: label ? `– ${label} –` : '—',
  value: '',
})

export const findValueOption = (
  options: ReadonlyArray<Option>,
  value?: string,
) => {
  // NOTE: The returned option MUST NOT be a copy (with trimmed value,
  // even if it would look nicer) because react-select seems to do an
  // internal `===` comparison against the options list, and thus copies
  // will fail to appear selected in the dropdown list.
  return (value && options.find((opt) => opt.value === value)) || null
}

export type EntityOption = Option & {
  mainCategory?: string
  department?: string
}

export const mapEntityToOptions = (
  entities?: Array<
    | OfficialJournalOfIcelandAdvertEntity
    | OfficialJournalOfIcelandAdvertType
    | OfficialJournalOfIcelandAdvertCategory
    | OfficialJournalOfIcelandAdvertMainCategory
  >,
): EntityOption[] => {
  if (!entities) {
    return []
  }
  return entities.map((e) => {
    return {
      label: e.title,
      value: e.slug,
    }
  })
}

export const sortCategories = (cats: EntityOption[]) => {
  return cats.sort((a, b) => {
    return sortAlpha('title')(a, b)
  })
}

export const formatDate = (date: string, df = 'dd.MM.yyyy') => {
  try {
    return format(new Date(date), df, { locale: is })
  } catch (e) {
    throw new Error(`Could not format date: ${date}`)
  }
}
