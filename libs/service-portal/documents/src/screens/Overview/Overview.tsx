import React, { useState, useCallback, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Text,
  Box,
  Stack,
  Columns,
  Column,
  Button,
  Pagination,
  DatePicker,
  GridRow,
  GridColumn,
  LoadingDots,
  Hidden,
  Checkbox,
  Filter,
  FilterInput,
  FilterMultiChoice,
  AccordionItem,
  Accordion,
} from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  useScrollToRefOnUpdate,
  AccessDeniedLegal,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { Document, Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'
import { m } from '@island.is/service-portal/core'
import { messages } from '../../utils/messages'
import DocumentLine from '../../components/DocumentLine/DocumentLine'
import getOrganizationLogoUrl from '../../utils/getOrganizationLogoUrl'
import HeaderArrow from '../../components/HeaderArrow/HeaderArrow'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isEqual from 'lodash/isEqual'
import isWithinInterval from 'date-fns/isWithinInterval'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import orderBy from 'lodash/orderBy'
import * as Sentry from '@sentry/react'
import * as styles from './Overview.css'
import FilterTag from '../../components/FilterTag/FilterTag'
import differenceInYears from 'date-fns/differenceInYears'

const GET_DOCUMENT_CATEGORIES = gql`
  query documentCategories {
    getDocumentCategories {
      id
      name
    }
  }
`

const NO_GROUPS_AVAILABLE = 'NO_GROUPS_AVAILABLE'

const pageSize = 15
const defaultStartDate = null
const defaultEndDate = null

const defaultFilterValues = {
  dateFrom: defaultStartDate,
  dateTo: defaultEndDate,
  activeCategories: [],
  activeGroups: [],
  searchQuery: '',
  showUnread: false,
}

type SortKeyType = 'date' | 'subject' | 'senderName'
type SortDirectionType = 'asc' | 'desc'

type FilterValues = {
  dateFrom: Date | null
  dateTo: Date | null
  searchQuery: string
  showUnread: boolean
  activeCategories: string[]
  activeGroups: string[]
}

type GroupsValue = {
  value: string
  label: string
}

const getFilteredDocuments = (
  documents: Document[],
  filterValues: FilterValues,
): Document[] => {
  const {
    dateFrom,
    dateTo,
    searchQuery,
    showUnread,
    activeCategories,
    activeGroups,
  } = filterValues
  let filteredDocuments = documents.filter((doc) => {
    const minDate = dateFrom || new Date('1900-01-01')
    const maxDate = dateTo || addMonths(new Date(), 3)
    return isWithinInterval(new Date(doc.date), {
      start: isBefore(maxDate, minDate) ? maxDate : minDate,
      end: isAfter(minDate, maxDate) ? minDate : maxDate,
    })
  })

  if (activeCategories && activeCategories.length > 0) {
    filteredDocuments = filteredDocuments.filter((doc) =>
      activeCategories.includes(doc.senderNatReg),
    )
  }

  if (activeGroups && activeGroups.length > 0) {
    filteredDocuments = filteredDocuments.filter((doc) =>
      activeGroups.includes(doc?.categoryId || 'NO_ID'),
    )
  }

  if (showUnread) {
    filteredDocuments = filteredDocuments.filter((x) => !x.opened)
  }

  if (searchQuery) {
    filteredDocuments = filteredDocuments.filter((x) =>
      x.subject.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }
  return filteredDocuments
}

const getSortDirection = (currentDirection: SortDirectionType) => {
  const reverseDirection = currentDirection === 'asc' ? 'desc' : 'asc'
  return reverseDirection
}

export const ServicePortalDocuments: ServicePortalModuleComponent = ({
  userInfo,
  client,
}) => {
  useNamespaces('sp.documents')
  Sentry.configureScope((scope) =>
    scope.setTransactionName('Electronic-Documents'),
  )

  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [sortState, setSortState] = useState<{
    direction: SortDirectionType
    key: SortKeyType
  }>({
    direction: 'desc',
    key: 'date',
  })
  const [searchInteractionEventSent, setSearchInteractionEventSent] = useState(
    false,
  )
  const { scrollToRef } = useScrollToRefOnUpdate([page])
  const { pathname } = useLocation()

  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )

  const [groupsAvailable, setGroupsAvailable] = useState<
    GroupsValue[] | typeof NO_GROUPS_AVAILABLE
  >([])
  const { data, loading, error } = useListDocuments(userInfo.profile.nationalId)
  const { data: groupData } = useQuery<Query>(GET_DOCUMENT_CATEGORIES)

  const isLegal = userInfo.profile.delegationType?.includes('LegalGuardian')
  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }
  useEffect(() => {
    const groupArray = groupData?.getDocumentCategories ?? []
    const docs = data.documents ?? []
    if (
      groupArray.length > 0 &&
      docs.length > 0 &&
      groupsAvailable !== NO_GROUPS_AVAILABLE &&
      groupsAvailable.length === 0
    ) {
      const filteredGroups = groupArray
        .filter((itemGroup) =>
          docs.some((doc) => doc.categoryId === itemGroup.id),
        )
        .map((group) => ({
          value: group.id,
          label: group.name,
        }))

      const groups =
        filteredGroups.length > 0 ? [...filteredGroups] : NO_GROUPS_AVAILABLE
      setGroupsAvailable(groups)
    }
  }, [groupData, data])

  const getFilteredSorted = (
    documents: Document[],
    filterValues: FilterValues,
  ): Document[] => {
    const filteredArray = getFilteredDocuments(documents, filterValues)
    const sortedFiltered =
      sortState?.key && sortState?.direction
        ? orderBy(
            filteredArray,
            sortState.key === 'date'
              ? (item) => new Date(item[sortState.key])
              : sortState.key,
            sortState.direction,
          )
        : filteredArray
    return sortedFiltered
  }
  const categories = data.categories
  const filteredDocuments = getFilteredSorted(data.documents, filterValue)
  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(filteredDocuments.length / pageSize),
  }
  const handleDateFromInput = useCallback((value: Date | null) => {
    setPage(1)
    setFilterValue((oldState) => {
      const { dateTo } = oldState
      const dateToValue = () => {
        if (!value) {
          return dateTo
        }
        return dateTo ? (isAfter(value, dateTo) ? value : dateTo) : dateTo
      }
      return {
        ...oldState,
        dateTo: dateToValue(),
        dateFrom: value,
      }
    })
  }, [])

  const handleDateToInput = useCallback((value: Date | null) => {
    setPage(1)
    setFilterValue((oldState) => ({
      ...oldState,
      dateTo: value,
    }))
  }, [])

  const handlePageChange = useCallback((page: number) => setPage(page), [])

  const handleCategoriesChange = useCallback((selected: string[]) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeCategories: [...selected],
    }))
  }, [])

  const handleGroupChange = useCallback((selected: string[]) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeGroups: [...selected],
    }))
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      searchQuery: value,
    }))
    if (!searchInteractionEventSent) {
      documentsSearchDocumentsInitialized(pathname)
      setSearchInteractionEventSent(true)
    }
  }, [])

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

  const handleShowUnread = useCallback((showUnread: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      showUnread,
    }))
  }, [])

  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const getCategoryTitle = (id: string) => {
    const category = categories?.find((item) => item.value === id)
    return category?.label || ''
  }

  const getGroupTitle = (id: string) => {
    if (groupsAvailable === NO_GROUPS_AVAILABLE) {
      return ''
    }
    const group = groupsAvailable?.find((item) => item.value === id)
    return group?.label || ''
  }

  const documentsFoundText = () =>
    filteredDocuments.length === 1 ||
    (lang === 'is' && filteredDocuments.length % 10 === 1)
      ? messages.foundSingular
      : messages.found

  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  if (isLegal && isOver15) {
    return <AccessDeniedLegal userInfo={userInfo} client={client} />
  }
  return (
    <Box marginBottom={[4, 4, 6, 10]}>
      <Stack space={3}>
        <Text variant="h3" as="h1">
          {formatMessage(messages.title)}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="7/12">
            <Text variant="default">{formatMessage(messages.intro)}</Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 6]}>
          <Filter
            resultCount={0}
            variant="popover"
            align="left"
            reverse
            labelClear={formatMessage(m.clearFilter)}
            labelClearAll={formatMessage(m.clearAllFilters)}
            labelOpen={formatMessage(m.openFilter)}
            labelClose={formatMessage(m.closeFilter)}
            filterInput={
              <FilterInput
                placeholder={formatMessage(m.searchPlaceholder)}
                name="rafraen-skjol-input"
                value={filterValue.searchQuery}
                onChange={(value) => handleSearchChange(value)}
                backgroundColor="blue"
              />
            }
            onFilterClear={handleClearFilters}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="spaceBetween"
              paddingX={3}
              className={styles.unreadFilter}
            >
              <Box paddingY={3}>
                <Checkbox
                  id="show-unread"
                  label={formatMessage(messages.onlyShowUnread)}
                  checked={filterValue.showUnread}
                  onChange={(e) => handleShowUnread(e.target.checked)}
                />
              </Box>
              <Box
                borderBottomWidth="standard"
                borderColor="blue200"
                width="full"
              />
            </Box>
            <FilterMultiChoice
              labelClear={formatMessage(m.clearSelected)}
              singleExpand={false}
              onChange={({ categoryId, selected }) => {
                if (categoryId === 'institution') {
                  handleCategoriesChange(selected)
                }
                if (categoryId === 'group') {
                  handleGroupChange(selected)
                }
              }}
              onClear={(categoryId) => {
                if (categoryId === 'institution') {
                  setFilterValue((oldFilter) => ({
                    ...oldFilter,
                    activeCategories: [],
                  }))
                }
                if (categoryId === 'group') {
                  setFilterValue((oldFilter) => ({
                    ...oldFilter,
                    activeGroups: [],
                  }))
                }
              }}
              categories={[
                {
                  id: 'institution',
                  label: formatMessage(messages.institutionLabel),
                  selected: [...filterValue.activeCategories],
                  filters: categories,
                  inline: false,
                  singleOption: false,
                },
                {
                  id: 'group',
                  label: formatMessage(messages.groupLabel),
                  selected: [...filterValue.activeGroups],
                  filters: Array.isArray(groupsAvailable)
                    ? groupsAvailable
                    : [],
                  inline: false,
                  singleOption: false,
                },
              ]}
            ></FilterMultiChoice>
            <Box className={styles.dateFilter} paddingX={3}>
              <Box
                borderBottomWidth="standard"
                borderColor="blue200"
                width="full"
              />
              <Box marginTop={1}>
                <Accordion
                  dividerOnBottom={false}
                  dividerOnTop={false}
                  singleExpand={false}
                >
                  <AccordionItem
                    key="date-accordion-item"
                    id="date-accordion-item"
                    label={formatMessage(m.datesLabel)}
                    labelUse="h5"
                    labelVariant="h5"
                    iconVariant="small"
                  >
                    <Box display="flex" flexDirection="column">
                      <DatePicker
                        label={formatMessage(m.datepickerFromLabel)}
                        placeholderText={formatMessage(m.datepickLabel)}
                        locale="is"
                        backgroundColor="blue"
                        size="xs"
                        selected={filterValue.dateFrom}
                        handleChange={handleDateFromInput}
                      />
                      <Box marginTop={3}>
                        <DatePicker
                          label={formatMessage(m.datepickerToLabel)}
                          placeholderText={formatMessage(m.datepickLabel)}
                          locale="is"
                          backgroundColor="blue"
                          size="xs"
                          selected={filterValue.dateTo}
                          handleChange={handleDateToInput}
                          minDate={filterValue.dateFrom || undefined}
                        />
                      </Box>
                    </Box>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Box>
          </Filter>
          <Hidden print>
            {hasActiveFilters() && (
              <Box marginTop={4}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                >
                  <Box display="flex">
                    <Box display="flex">
                      {filterValue.activeCategories.length > 0 &&
                        filterValue.activeCategories.map((activecat) => (
                          <FilterTag
                            onClick={() =>
                              handleCategoriesChange(
                                filterValue.activeCategories.filter(
                                  (item) => item !== activecat,
                                ),
                              )
                            }
                            key={`cat-${activecat}`}
                            title={getCategoryTitle(activecat)}
                          />
                        ))}
                      {filterValue.activeGroups.length > 0 &&
                        filterValue.activeGroups.map((activeGroup) => (
                          <FilterTag
                            onClick={() =>
                              handleGroupChange(
                                filterValue.activeGroups.filter(
                                  (item) => item !== activeGroup,
                                ),
                              )
                            }
                            key={`group-${activeGroup}`}
                            title={getGroupTitle(activeGroup)}
                          />
                        ))}
                      {filterValue.dateFrom && (
                        <FilterTag
                          onClick={() => handleDateFromInput(null)}
                          title={`${formatMessage(
                            m.datepickerFromLabel,
                          )} - ${format(filterValue.dateFrom, dateFormat.is)}`}
                        />
                      )}
                      {filterValue.dateTo && (
                        <FilterTag
                          onClick={() => handleDateToInput(null)}
                          title={`${formatMessage(
                            m.datepickerToLabel,
                          )} - ${format(filterValue.dateTo, dateFormat.is)}`}
                        />
                      )}
                      {filterValue.showUnread && (
                        <FilterTag
                          onClick={() => handleShowUnread(false)}
                          title={formatMessage(messages.onlyShowUnreadShort)}
                        />
                      )}
                    </Box>
                    <Box marginLeft={1}>
                      <Button
                        icon="reload"
                        size="small"
                        variant="text"
                        onClick={handleClearFilters}
                      >
                        {formatMessage(m.clearFilter)}
                      </Button>
                    </Box>
                  </Box>
                  <Text variant="eyebrow" as="h3">{`${
                    filteredDocuments.length
                  } ${formatMessage(documentsFoundText())}`}</Text>
                </Box>
              </Box>
            )}
          </Hidden>
          <Box marginTop={[0, 3]}>
            <Hidden below="sm">
              <Box
                className={styles.tableHeading}
                paddingY={2}
                background="blue100"
              >
                <GridRow>
                  <GridColumn span={['1/1', '2/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'date'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderDate)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'date',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '4/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'subject'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderInformation)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'subject',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '3/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'senderName'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderGroup)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'senderName',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '3/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'senderName'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderInstitution)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'senderName',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                </GridRow>
              </Box>
            </Hidden>
            {loading && (
              <Box display="flex" justifyContent="center" padding={4}>
                <LoadingDots large />
              </Box>
            )}
            {!loading && !error && filteredDocuments?.length === 0 && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Text variant="h3" as="h3">
                  {formatMessage(messages.notFound)}
                </Text>
              </Box>
            )}
            {error && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Text variant="h3" as="h3">
                  {formatMessage(messages.error)}
                </Text>
              </Box>
            )}
            <Box marginTop={[2, 0]}>
              {filteredDocuments
                ?.slice(pagedDocuments.from, pagedDocuments.to)
                .map((doc, index) => (
                  <Box key={doc.id} ref={index === 0 ? scrollToRef : null}>
                    <DocumentLine
                      img={getOrganizationLogoUrl(
                        doc.senderName,
                        organizations,
                      )}
                      documentLine={doc}
                      documentCategories={
                        groupData?.getDocumentCategories ?? []
                      }
                    />
                  </Box>
                ))}
            </Box>
          </Box>
          {filteredDocuments && filteredDocuments.length > pageSize && (
            <Box marginTop={4}>
              <Pagination
                page={page}
                totalPages={pagedDocuments.totalPages}
                renderLink={(page, className, children) => (
                  <button
                    className={className}
                    onClick={handlePageChange.bind(null, page)}
                  >
                    {children}
                  </button>
                )}
              />
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

export default ServicePortalDocuments
