import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
  Text,
  Stack,
  Hidden,
  LoadingDots,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { HeroBanner } from '../../components'
import Card from '../../components/Card/Card'
import Layout from '../../components/Layout/Layout'
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter'
import {
  ArrOfStatistics,
  ArrOfTypes,
  Case,
  CaseFilter,
  FilterInputItems,
} from '../../types/interfaces'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useQuery } from '@apollo/client'
import Filter from '../../components/Filter/Filter'
import { CaseSortOptions } from '../../types/enums'
import { GET_CASES } from './getCases.graphql'
import initApollo from '../../graphql/client'
import { getInitFilterValues } from '../../utils/helpers'
import Pagination from '../../components/Pagination/Pagination'

const CARDS_PER_PAGE = 12
interface HomeProps {
  types: ArrOfTypes
  statistics: ArrOfStatistics
}
export const Home = ({ types, statistics }: HomeProps) => {
  const [page, setPage] = useState<number>(0)
  const {
    caseStatuses,
    caseTypes,
    Institutions,
    allInstitutions,
    PolicyAreas,
    allPolicyAreas,
    sorting,
    period,
  } = getInitFilterValues({ types: types })

  const defaultValues = {
    searchQuery: '',
    sorting: { items: sorting, isOpen: true },
    caseStatuses: { items: caseStatuses, isOpen: true },
    caseTypes: { items: caseTypes, isOpen: true },
    policyAreas: allPolicyAreas,
    institutions: allInstitutions,
    period: period,
  }

  const [filters, setFilters] = useState<CaseFilter>({
    searchQuery: '',
    sorting: { items: sorting, isOpen: true },
    caseStatuses: { items: caseStatuses, isOpen: true },
    caseTypes: { items: caseTypes, isOpen: true },
    policyAreas: allPolicyAreas,
    institutions: allInstitutions,
    period: period,
  } as any)

  const input = {
    caseStatuses: filters.caseStatuses.items
      .filter((item: FilterInputItems) => item.checked)
      .map((item: FilterInputItems) => parseInt(item.value)),
    caseTypes: filters.caseTypes.items
      .filter((item: FilterInputItems) => item.checked)
      .map((item: FilterInputItems) => parseInt(item.value)),
    orderBy: Object.keys(CaseSortOptions).find(
      (key) =>
        CaseSortOptions[key] ===
        filters.sorting.items.filter(
          (item: FilterInputItems) => item.checked,
        )[0].label,
    ),
    searchQuery: filters.searchQuery,
    policyAreas: filters.policyAreas,
    institutions: filters.institutions,
    dateFrom: filters.period.from,
    dateTo: filters.period.to,
    pageSize: CARDS_PER_PAGE,
    pageNumber: page,
  }

  useEffect(() => {
    setPage(0)
  }, [filters])

  const client = initApollo()

  const { data, loading, error, refetch } = useQuery(GET_CASES, {
    client: client,
    ssr: true,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })

  const { consultationPortalGetCases: casesData = [] } = data ?? {}

  const { cases = [], filterGroups = {}, total = 1 } = casesData

  useEffect(() => {
    const insertFilterCount = setTimeout(() => {
      if (filterGroups && !loading) {
        const caseTypesList = filterGroups?.CaseTypes
          ? Object.entries(filterGroups.CaseTypes).map(([value, count]) => ({
              value,
              count,
            }))
          : []

        const caseTypesMerged = filters.caseTypes.items.map((item) => ({
          ...item,
          ...caseTypesList.find((val) => val.value === item.value),
        }))

        const caseStatusesList = filterGroups?.Statuses
          ? Object.entries(filterGroups.Statuses).map(([value, count]) => ({
              value,
              count,
            }))
          : []
        const caseStatusesMerged = filters.caseStatuses.items.map((item) => ({
          ...item,
          ...caseStatusesList.find((val) => val.value === item.value),
        }))

        const filtersCopy = { ...filters }
        filtersCopy.caseTypes.items = caseTypesMerged
        filtersCopy.caseStatuses.items = caseStatusesMerged
        setFilters(filtersCopy)
      }
    }, 500)

    return () => {
      clearTimeout(insertFilterCount)
    }
  }, [filterGroups])

  const renderCards = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          width="full"
          alignItems="center"
          justifyContent="center"
          style={{ height: 200 }}
        >
          <LoadingDots color="blue" large />
        </Box>
      )
    }

    if (cases?.length === 0) {
      return <EmptyState />
    }

    return (
      <>
        {cases && (
          <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
            {cases.map((item: Case, index: number) => {
              const card = {
                id: item.id,
                title: item.name,
                tag: item.statusName,
                published: item.created,
                processEnds: item.processEnds,
                processBegins: item.processBegins,
                eyebrows: [item.typeName, item.institutionName],
              }
              return (
                <Card key={index} card={card} frontPage showPublished>
                  <Stack space={2}>
                    <Text variant="eyebrow" color="purple400">
                      {`Fjöldi umsagna: ${item.adviceCount}`}
                    </Text>
                    <Box
                      style={{
                        wordBreak: 'break-word',
                        height: '105px',
                      }}
                      overflow="hidden"
                    >
                      <Text variant="small" color="dark400">
                        {item.shortDescription}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              )
            })}
          </Tiles>
        )}
        <Pagination
          page={page}
          setPage={(page: number) => setPage(page)}
          totalPages={Math.ceil(total / CARDS_PER_PAGE)}
        />
      </>
    )
  }

  return (
    <Layout isFrontPage seo={{ title: 'Öll mál' }}>
      <HeroBanner statistics={statistics} />
      <SearchAndFilter
        PolicyAreas={PolicyAreas}
        defaultPolicyAreas={allPolicyAreas}
        Institutions={Institutions}
        defaultInstitutions={allInstitutions}
        filters={filters}
        setFilters={(arr: CaseFilter) => setFilters(arr)}
      />
      <GridContainer>
        <GridRow>
          <GridColumn span={['0', '0', '0', '3/12', '3/12']}>
            <Hidden below="lg">
              <Filter
                filters={filters}
                setFilters={(arr: CaseFilter) => setFilters(arr)}
                defaultValues={defaultValues}
              />
            </Hidden>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '9/12', '9/12']}>
            {renderCards()}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Home
