import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  LoadingDots,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  GenericTag,
  GetNamespaceQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetPublishedMaterialArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PUBLISHED_MATERIAL_QUERY } from '../../queries/PublishedMaterial'
import FilterTag from './components/FilterTag/FilterTag'
import { PublishedMaterialItem } from './components/PublishedMaterialItem'
import {
  getFilterCategories,
  getFilterTags,
  getGenericTagGroupHierarchy,
  getInitialParameters,
  Ordering,
} from './utils'
import { OrderByItem } from './components/OrderByItem'
import { useSelect } from 'downshift'
import * as styles from './PublishedMaterial.css'

const ASSETS_PER_PAGE = 20
const DEBOUNCE_TIME_IN_MS = 300

interface PublishedMaterialProps {
  organizationPage: Query['getOrganizationPage']
  genericTagFilters: GenericTag[]
  namespace: Record<string, string>
}

const PublishedMaterial: Screen<PublishedMaterialProps> = ({
  organizationPage,
  genericTagFilters,
  namespace,
}) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const [searchValue, setSearchValue] = useState('')
  const [ordering, setOrdering] = useState<Ordering>({
    field: 'releaseDate',
    order: 'desc',
  })
  const n = useNamespace(namespace)

  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()
  const { activeLocale } = useI18n()

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url === router.asPath ||
        childrenLinks.some((link) => link.url === router.asPath),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === router.asPath,
      })),
    }),
  )

  // The page number is 1-based meaning that page 1 is the first page
  const [page, setPage] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
  const [parameters, setParameters] = useState<Record<string, string[]>>({})
  const [queryVariables, setQueryVariables] = useState({
    variables: {
      input: {
        lang: activeLocale,
        organizationSlug: (router.query.slug as string) ?? '',
        tags: [],
        page: page,
        searchString: searchValue,
        size: ASSETS_PER_PAGE,
        tagGroups: {},
        sort: ordering,
      },
    },
  })
  const [publishedMaterial, setPublishedMaterial] = useState({
    items: [],
    total: 0,
  })

  const { data, loading, fetchMore } = useQuery<
    Query,
    QueryGetPublishedMaterialArgs
  >(GET_PUBLISHED_MATERIAL_QUERY, queryVariables)

  const initialFilterCategories = useMemo(
    () => getFilterCategories(genericTagFilters),
    [genericTagFilters],
  )

  useEffect(() => {
    if (data?.getPublishedMaterial)
      setPublishedMaterial(data.getPublishedMaterial)
  }, [data?.getPublishedMaterial])

  const filterCategories = initialFilterCategories.map((category) => ({
    ...category,
    selected: parameters[category.id] ?? category.selected,
  }))

  useEffect(() => {
    setParameters(getInitialParameters(initialFilterCategories))
  }, [initialFilterCategories])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)

    const selectedCategories: string[] = []
    filterCategories.forEach((c) =>
      c.selected.forEach((t) => selectedCategories.push(t)),
    )

    fetchMore({
      variables: {
        input: {
          lang: activeLocale,
          organizationSlug: (router.query.slug as string) ?? '',
          tags: selectedCategories,
          page: nextPage,
          searchString: searchValue,
          size: ASSETS_PER_PAGE,
          tagGroups: getGenericTagGroupHierarchy(filterCategories),
          sort: ordering,
        },
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getPublishedMaterial.items = [
          ...prevResult.getPublishedMaterial.items,
          ...fetchMoreResult.getPublishedMaterial.items,
        ]
        return fetchMoreResult
      },
    })
  }

  useDebounce(
    () => {
      setPage(1)

      const selectedCategories: string[] = []
      filterCategories.forEach((c) =>
        c.selected.forEach((t) => selectedCategories.push(t)),
      )

      setQueryVariables({
        variables: {
          input: {
            lang: activeLocale,
            organizationSlug: (router.query.slug as string) ?? '',
            tags: selectedCategories,
            page: 1,
            searchString: searchValue,
            size: ASSETS_PER_PAGE,
            tagGroups: getGenericTagGroupHierarchy(filterCategories),
            sort: ordering,
          },
        },
      })
      setIsTyping(false)
    },
    DEBOUNCE_TIME_IN_MS,
    [parameters, activeLocale, searchValue, ordering],
  )

  const pageTitle = n('pageTitle', 'Útgefið efni')

  const isMobile = width < theme.breakpoints.md

  const numberOfItemsThatCouldBeLoaded =
    (publishedMaterial?.total ?? page * ASSETS_PER_PAGE) -
    page * ASSETS_PER_PAGE

  const selectedFilters = getFilterTags(filterCategories)

  const orderByItems = [
    {
      title: n('orderByTitleAscending', 'Titill (a-ö)'),
      onClick: () =>
        setOrdering({
          field: 'title.sort',
          order: 'asc',
        }),
      isSelected: ordering.field === 'title.sort' && ordering.order === 'asc',
    },
    {
      title: n('orderByTitleDescending', 'Titill (ö-a)'),
      onClick: () =>
        setOrdering({
          field: 'title.sort',
          order: 'desc',
        }),
      isSelected: ordering.field === 'title.sort' && ordering.order === 'desc',
    },
    {
      title: n('orderByReleaseDateDescending', 'Útgáfudagur (nýtt)'),
      onClick: () =>
        setOrdering({
          field: 'releaseDate',
          order: 'desc',
        }),
      isSelected: ordering.field === 'releaseDate' && ordering.order === 'desc',
    },
    {
      title: n('orderByReleaseDateAscending', 'Útgáfudagur (gamalt)'),
      onClick: () =>
        setOrdering({
          field: 'releaseDate',
          order: 'asc',
        }),
      isSelected: ordering.field === 'releaseDate' && ordering.order === 'asc',
    },
  ]

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items: orderByItems })

  useEffect(() => {
    if (selectedItem?.onClick) selectedItem.onClick()
  }, [selectedItem])

  const orderByButtonRef = useRef<HTMLDivElement | null>(null)

  return (
    <OrganizationWrapper
      pageTitle={pageTitle}
      organizationPage={organizationPage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('sidebarTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <GridContainer className={styles.container}>
        <GridColumn span="12/12">
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
              <Text variant="h1" as="h1" marginBottom={4} marginTop={1}>
                {pageTitle}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            <Filter
              resultCount={publishedMaterial?.total ?? 0}
              variant={isMobile ? 'dialog' : 'popover'}
              align="right"
              labelClear={n('clearFilter', 'Hreinsa síu')}
              labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
              labelOpen={n('openFilter', 'Opna síu')}
              labelClose={n('closeFilter', 'Loka síu')}
              labelResult={n('viewResults', 'Skoða niðurstöður')}
              labelTitle={n('filterMenuTitle', 'Sía útgefið efni')}
              filterInput={
                <FilterInput
                  placeholder={n(
                    'filterSearchPlaceholder',
                    'Sía eftir leitarorði',
                  )}
                  name="filterInput"
                  value={searchValue}
                  onChange={(value) => {
                    setSearchValue(value)
                    setIsTyping(true)
                  }}
                />
              }
              onFilterClear={() => {
                setParameters(getInitialParameters(filterCategories))
                setSearchValue('')
                setIsTyping(true)
              }}
            >
              <FilterMultiChoice
                labelClear={n('clearSelection', 'Hreinsa val')}
                onChange={({ categoryId, selected }) => {
                  setIsTyping(true)
                  setParameters((prevParameters) => ({
                    ...prevParameters,
                    [categoryId]: selected,
                  }))
                }}
                onClear={(categoryId) => {
                  setIsTyping(true)
                  setParameters((prevParameters) => ({
                    ...prevParameters,
                    [categoryId]: [],
                  }))
                }}
                categories={filterCategories}
              ></FilterMultiChoice>
            </Filter>
          </GridRow>

          <GridRow marginTop={2} align="center">
            <Box
              style={{
                visibility: loading || isTyping ? 'visible' : 'hidden',
              }}
            >
              <LoadingDots />
            </Box>
          </GridRow>
          <GridRow alignItems="center">
            <GridColumn span="8/12">
              <Inline space={1}>
                {selectedFilters.map(({ label, value, category }) => (
                  <FilterTag
                    key={value}
                    onClick={() => {
                      setIsTyping(true)
                      setParameters((prevParameters) => ({
                        ...prevParameters,
                        [category]: (prevParameters[category] ?? []).filter(
                          (prevValue) => prevValue !== value,
                        ),
                      }))
                    }}
                  >
                    {label}
                  </FilterTag>
                ))}
              </Inline>
            </GridColumn>
            <GridColumn span="4/12">
              <GridRow align="flexEnd">
                <div ref={orderByButtonRef}>
                  <button
                    type="button"
                    tabIndex={0}
                    className={styles.orderByToggleButton}
                    {...getToggleButtonProps()}
                  >
                    <div className={styles.orderByToggleButtonText}>
                      {n('orderBy', 'Raða eftir')}
                    </div>
                    <Icon size="small" icon="chevronDown" />
                  </button>
                </div>
                <ul
                  style={{
                    display: isOpen ? 'block' : 'none',
                    marginTop: orderByButtonRef.current
                      ? (orderByButtonRef.current.getBoundingClientRect()
                          ?.height ?? 24) + 4
                      : 28,
                  }}
                  className={styles.orderByItemContainer}
                  {...getMenuProps()}
                >
                  {orderByItems.map((item, index) => (
                    <li key={index} {...getItemProps({ item, index })}>
                      <OrderByItem
                        isSelected={item.isSelected}
                        isHighlighted={highlightedIndex === index}
                        hasBorderTop={index !== 0}
                        onClick={item.onClick}
                      >
                        {item.title}
                      </OrderByItem>
                    </li>
                  ))}
                </ul>
              </GridRow>
            </GridColumn>
          </GridRow>
          {(publishedMaterial?.items ?? []).map((item, index) => {
            return (
              <GridRow
                key={`${item.id}-${index}`}
                marginTop={2}
                marginBottom={2}
              >
                <PublishedMaterialItem item={item} />
              </GridRow>
            )
          })}
          {numberOfItemsThatCouldBeLoaded > 0 && (
            <GridRow marginTop={8} align="center">
              <Button onClick={loadMore} disabled={loading}>
                {n('seeMore', 'Sjá meira')} ({numberOfItemsThatCouldBeLoaded})
              </Button>
            </GridRow>
          )}
        </GridColumn>
      </GridContainer>
    </OrganizationWrapper>
  )
}

PublishedMaterial.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'OrganizationPublishedMaterial',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables?.data?.getNamespace?.fields ?? '{}')
      }),
  ])

  if (!getOrganizationPage || !getOrganization) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    genericTagFilters:
      getOrganization.publishedMaterialSearchFilterGenericTags ?? [],
    namespace,
    ...getThemeConfig(getOrganizationPage.theme, getOrganizationPage.slug),
  }
}

export default withMainLayout(PublishedMaterial)
