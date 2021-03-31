import React, { FC, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SubpageMainContent } from '@island.is/web/components'
import {
  CategoryCard,
  Checkbox,
  Filter,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { NamespaceGetter, useNamespace } from '@island.is/web/hooks'
import { NoChildren } from '@island.is/web/types'
import { LawChapterTree, Ministry, RegulationHomeTexts } from './mockData'
import { OptionTypeBase, ValueType } from 'react-select'
import { useRegulationLinkResolver } from './regulationUtils'

// ---------------------------------------------------------------------------

/** Icky utility function to handle the buggy typing of react-select
 *
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
 */
const getRSValue = (option: ValueType<OptionTypeBase>) => {
  const opt: OptionTypeBase | undefined | null = Array.isArray(option)
    ? (option as Array<OptionTypeBase>)[0]
    : option
  return opt ? opt.value : undefined
}

const emptyOption = (label?: string): Option => ({
  value: '',
  label: label != null ? `– ${label} –` : '—',
})

/** Looks through a list of `Option`s for one with a matching
 * `value` and returns a copy of it with its label trimmed for nicer
 * display by `react-select`
 *
 * If a match is not found it returns `null` because that's the
 * magic value that tricks `react-select` to show the "placeholder" value
 */
const findValueOption = (
  options: ReadonlyArray<Option>,
  value?: string,
): Option | null => {
  if (!value) {
    return null
  }
  const opt = options.find((opt) => opt.value === value)
  return (
    (opt && {
      value: opt.value,
      label: opt.label.trim(),
    }) ||
    null
  )
}

const isLegacyMinistry = (
  ministries: ReadonlyArray<Ministry>,
  slug: string,
) => {
  const ministry = ministries.find((m) => m.slug === slug)
  return !!(ministry && !ministry.current)
}

const yearToOption = (year: number | string): Option => {
  const value = String(year)
  return {
    value,
    label: value,
  }
}

const filterOrder: Record<RegulationSearchKeys, number> = {
  q: 1,
  year: 2,
  rn: 3,
  ch: 4,
  all: 5,
}

/** Returns a copy of the original query with any falsy values filtered out  */
const cleanQuery = (
  query: Record<RegulationSearchKeys, string | null | undefined>,
) =>
  Object.entries(query)
    .sort((a, b) => {
      const keyA = a[0] as RegulationSearchKeys
      const keyB = b[0] as RegulationSearchKeys
      return (filterOrder[keyA] || 999) > (filterOrder[keyB] || 999) ? 1 : -1
    })
    .reduce<Record<string, string>>((newQuery, [key, value]) => {
      if (value) {
        newQuery[key] = value
      }
      return newQuery
    }, {})

export type RegulationSearchKeys = 'q' | 'rn' | 'year' | 'ch' | 'all'
export type RegulationSearchFilters = Record<RegulationSearchKeys, string>

// ---------------------------------------------------------------------------

export type RegulationsSearchSectionProps = {
  searchResults: ReadonlyArray<{
    name: string
    title: string
    ministry?: { name: string; slug: string }
  }>
  searchFilters: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: ReadonlyArray<Ministry>
  lawcCapters: Readonly<LawChapterTree>
  texts: RegulationHomeTexts
} & NoChildren

export const RegulationsSearchSection: FC<RegulationsSearchSectionProps> = (
  props,
) => {
  const filters = props.searchFilters
  const txt = useNamespace(props.texts)

  const { linkToRegulation } = useRegulationLinkResolver()
  const router = useRouter()

  const activeFilters = useMemo(
    () => Object.values(filters).some((value) => !!value),
    [filters],
  )

  const yearOptions = useMemo(() => {
    return [emptyOption(txt('searchYearEmptyOption'))].concat(
      props.years.map(yearToOption),
    ) as ReadonlyArray<Option>
  }, [props.years])

  const ministryOptions = useMemo(() => {
    return [emptyOption(txt('searchMinistryEmptyOption'))].concat(
      props.ministries.map(
        (m): Option => ({
          value: m.slug,
          label:
            m.name + (m.current ? ` ${txt('searchLegacyMinistrySuffix')}` : ''),
        }),
      ),
    ) as ReadonlyArray<Option>
  }, [props.ministries])

  const lawChapterOptions = useMemo(
    () =>
      props.lawcCapters.reduce<Array<Option>>(
        (opts, { name, slug, subChapters }) => {
          opts.push({
            value: slug,
            label: `${name}`,
          })
          opts = opts.concat(
            subChapters.map(({ name, slug }) => ({
              value: slug,
              label: `    ${name}`,
            })),
          )
          return opts
        },
        [emptyOption(txt('searchChapterEmptyOption'))],
      ) as ReadonlyArray<Option>,
    [props.lawcCapters],
  )

  const doSearch = (key: RegulationSearchKeys, value: string) => {
    router.replace({
      query: cleanQuery({
        ...props.searchFilters,
        [key]: value || undefined,
      }),
    })
  }
  const clearSearch = () => {
    router.replace({
      query: null,
    })
  }

  return (
    <SidebarLayout
      paddingTop={6}
      fullWidthContent="right"
      sidebarContent={
        <Filter
          labelClear={txt('searchClearLabel')}
          labelOpen={txt('searchOpenLabel')}
          labelClose={txt('searchCloseLabel')}
          labelResult={txt('searchResultLabel')}
          labelTitle={txt('searchTitleLabel')}
          onFilterClear={clearSearch}
        >
          <FilterInput
            name="q"
            placeholder={txt('searchQueryLabel')}
            value={filters.q}
            onChange={(value) => doSearch('q', value)}
          />
          <Select
            name="year"
            isSearchable
            label={txt('searchYearLabel')}
            placeholder={txt('searchYearPlaceholder')}
            value={findValueOption(yearOptions, filters.year)}
            options={yearOptions}
            onChange={(option) => doSearch('year', getRSValue(option) || '')}
            size="sm"
          />
          <Select
            name="ch"
            isSearchable
            label={txt('searchChapterLabel')}
            placeholder={txt('searchChapterPlaceholder')}
            value={findValueOption(lawChapterOptions, filters.ch)}
            options={lawChapterOptions}
            onChange={(option) => doSearch('ch', getRSValue(option) || '')}
            size="sm"
          />
          <Select
            name="rn"
            isSearchable
            label={txt('searchMinistryLabel')}
            placeholder={txt('searchMinistryPlaceholder')}
            value={findValueOption(ministryOptions, filters.rn)}
            options={ministryOptions}
            onChange={(option) => doSearch('rn', getRSValue(option) || '')}
            size="sm"
          />
          <Checkbox
            id="regulations-search-amendments-checkbox"
            label={txt('searchIncludeAmendingLabel')}
            checked={!!filters.all}
            onChange={() => doSearch('all', !filters.all ? 'y' : '')}
          />
        </Filter>
      }
    >
      <SubpageMainContent
        main={
          <>
            <Text variant="h2" as="h2" marginBottom={3}>
              {activeFilters
                ? txt('searchResultsLegend')
                : txt('defaultRegulationListsLegend')}
            </Text>

            <GridContainer>
              <GridRow>
                {props.searchResults.map((reg, i) => (
                  <GridColumn
                    key={reg.name}
                    span={['1/1', '1/1', '1/2']}
                    paddingBottom={4}
                  >
                    <CategoryCard
                      href={linkToRegulation(reg.name)}
                      heading={reg.name}
                      text={reg.title}
                      tags={
                        reg.ministry && [
                          { label: reg.ministry.name, disabled: true },
                        ]
                      }
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </>
        }
      />
    </SidebarLayout>
  )
}
