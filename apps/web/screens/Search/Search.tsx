import React, { useRef, useEffect, useState, FC, useMemo } from 'react'
import Head from 'next/head'
import { NextRouter, useRouter } from 'next/router'
import NextLink from 'next/link'
import { Screen } from '../../types'
import { SearchInput, Card, CardTagsProps } from '@island.is/web/components'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Hidden,
  Pagination,
  Link,
  LinkContext,
  Navigation,
  NavigationItem,
  ColorSchemeContext,
  Inline,
  Tag,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
  GET_SEARCH_COUNT_QUERY,
  GET_SEARCH_RESULTS_TOTAL,
} from '../queries'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetSearchResultsDetailedQuery,
  GetSearchResultsNewsQuery,
  GetSearchCountTagsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Article,
  LifeEventPage,
  News,
  SearchableContentTypes,
  SearchableTags,
  AdgerdirPage,
  SubArticle,
  GetSearchResultsTotalQuery,
  OrganizationSubpage,
  Link as LinkItem,
} from '../../graphql/schema'
import { Image } from '@island.is/web/graphql/schema'
import { useLinkResolver, usePlausible } from '@island.is/web/hooks'
import { useLazyQuery } from '@apollo/client'

const PERPAGE = 10

type SearchQueryFilters = {
  category: string
  type: string
}

interface CategoryProps {
  q: string
  page: number
  searchResults: GetSearchResultsDetailedQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: GetNamespaceQuery['getNamespace']
}

interface SidebarTagMap {
  [key: string]: {
    title: string
    total: number
  }
}

interface SidebarData {
  totalTagCount: number
  tags: SidebarTagMap
  types: SidebarTagMap
}

type TagsList = {
  title: string
  count: number
  key: string
}

type SearchType = Article &
  LifeEventPage &
  News &
  AdgerdirPage &
  SubArticle &
  OrganizationSubpage &
  LinkItem

const connectedTypes: Partial<
  Record<
    SearchableContentTypes | string,
    Array<SearchableContentTypes | string>
  >
> = {
  webArticle: ['WebArticle', 'WebSubArticle'],
  webAdgerdirPage: ['WebAdgerdirPage'],
  webNews: ['WebNews'],
  webQNA: ['WebQna'],
  webLifeEventPage: ['WebLifeEventPage'],
  ArticlesWithProcessEntry: ['WebArticle'],
}

const Search: Screen<CategoryProps> = ({
  q,
  page,
  searchResults,
  countResults,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const replace = useReplace()
  const { query } = useRouter()
  usePlausible('Search Query', {
    query: (q ?? '').trim().toLowerCase(),
    source: 'Web',
  })
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const [activeSearchType, setActiveSearchType] = useState<string>('')
  const [sidebarData, setSidebarData] = useState<SidebarData>({
    totalTagCount: 0,
    tags: {},
    types: {},
  })

  const filters: SearchQueryFilters = {
    category: query.category as string,
    type: query.type as string,
  }

  const getArticleCount = useMemo(
    () => () => {
      let total = 0

      total +=
        (countResults?.typesCount ?? []).find((x) => x.key === 'webArticle')
          ?.count ?? 0

      total +=
        (countResults?.typesCount ?? []).find((x) => x.key === 'webSubArticle')
          ?.count ?? 0

      if (query.processentry) {
        return total + (countResults?.processEntryCount ?? 0)
      }

      return total
    },
    [
      countResults?.processEntryCount,
      countResults?.typesCount,
      query.processentry,
    ],
  )

  const getLabels = (item: SearchType) => {
    const labels = []

    switch (item.__typename) {
      case 'LifeEventPage':
        labels.push(n('lifeEvent'))
        break
      case 'News':
        labels.push(n('newsTitle'))
        break
      case 'AdgerdirPage':
        labels.push(n('adgerdirTitle'))
        break
      default:
        break
    }

    if (checkForProcessEntries(item)) {
      labels.push(n('applicationForm'))
    }

    if (item.group) {
      labels.push(item.group.title)
    }

    if (item.organization?.length) {
      labels.push(item.organization[0].title)
    }

    if (item.parent) {
      if (item.parent.group) {
        labels.push(item.parent.group.title)
      }

      if (item.parent.organization?.length) {
        labels.push(item.parent.organization[0].title)
      }
    }

    if (item.organizationPage?.organization?.title) {
      labels.push(item.organizationPage.organization.title)
    }

    return labels
  }

  const tagTitles:
    | Partial<Record<SearchableContentTypes, string>>
    | Record<string, string> = useMemo(
    () => ({
      webArticle: n('webArticle', 'Greinar'),
      webSubArticle: n('webSubArticle', 'Undirgreinar'),
      webAdgerdirPage: n('webAdgerdirPage', 'Viðspyrna'),
      webLink: n('webLink', 'Tenglar'),
      webNews: n('webNews', 'Fréttir og tilkynningar'),
      webQNA: n('webQNA', 'Spurt og svarað'),
      webLifeEventPage: n('webLifeEventPage', 'Lífsviðburðir'),
      ArticlesWithProcessEntry: n('processEntry', 'Umsókn'),
    }),
    [n],
  )

  const pathname = linkResolver('search').href

  // const getCombinedCount = (type: string) => {
  //   const types = connectedTypes[type] ?? []

  //   return types.map(firstLower).reduce((total, key) => {
  //     const item = countResults.typesCount.find((x) => key === x.key)

  //     if (item) {
  //       return total + item.count
  //     }

  //     return total
  //   }, 0)
  // }

  const tagsList = useMemo((): TagsList[] => {
    return [
      ...countResults.typesCount
        .filter((x) => x.key in tagTitles)
        .filter((x) =>
          Object.keys(connectedTypes).some((y) => y.includes(x.key)),
        )
        .map((x) => {
          let count = x.count

          if (x.key === 'webArticle') {
            count = getArticleCount()
          }

          return {
            title: tagTitles[x.key] as string,
            key: x.key,
            count,
          }
        }),
    ]
  }, [countResults.typesCount, getArticleCount, tagTitles])

  useEffect(() => {
    // we get the tag count manually since the total includes uncategorised data and the type count
    let totalTagCount = 0
    // create a map of sidebar tag data for easier lookup later
    const tagCountResults = countResults.tagCounts.reduce(
      (tagList: SidebarTagMap, { key, count: total, value: title }) => {
        // in some rare cases a tag might be empty we skip counting and rendering it
        if (key && title) {
          totalTagCount = totalTagCount + total

          tagList[key] = {
            title,
            total,
          }
        }

        return tagList
      },
      {},
    )

    // create a map of sidebar type data for easier lookup later
    const typeNames = {
      webNews: n('newsTitle'),
      webOrganizationSubpage: n('organizationsTitle', 'Opinberir aðilar'),
    }

    const typeCountResults = countResults.typesCount.reduce(
      (typeList: SidebarTagMap, { key, count: total }) => {
        if (Object.keys(typeNames).includes(key)) {
          typeList[key] = {
            title: typeNames[key],
            total,
          }
        }
        return typeList
      },
      {},
    )

    setSidebarData({
      totalTagCount,
      tags: tagCountResults,
      types: typeCountResults,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countResults])

  const checkForProcessEntries = (item: SearchType) => {
    if (item.__typename === 'Article') {
      const hasMainProcessEntry =
        !!item.processEntry?.processTitle || !!item.processEntry?.processLink
      const hasProcessEntryInBody = !!item.body?.filter((content) => {
        return content.__typename === 'ProcessEntry'
      }).length

      return hasMainProcessEntry || hasProcessEntryInBody
    }

    return false
  }

  const searchResultsItems = (searchResults.items as Array<SearchType>).map(
    (item) => ({
      typename: item.__typename,
      title: item.title,
      parentTitle: item.parent?.title,
      description: item.intro ?? item.description ?? item.parent?.intro,
      link: linkResolver(item.__typename, item?.url ?? item.slug.split('/')),
      categorySlug: item.category?.slug ?? item.parent?.category?.slug,
      category: item.category ?? item.parent?.category,
      hasProcessEntry: checkForProcessEntries(item),
      group: item.group,
      ...(item.image && { image: item.image as Image }),
      ...(item.thumbnail && { thumbnail: item.thumbnail as Image }),
      labels: getLabels(item),
    }),
  )

  useEffect(() => {
    let searchTypes = ''

    if (Object.keys(connectedTypes).includes(activeSearchType)) {
      searchTypes = connectedTypes[activeSearchType].map(firstLower).join()
    }

    replace({
      pathname,
      query: {
        q,
        ...(searchTypes && { type: searchTypes }),
        ...(activeSearchType === 'ArticlesWithProcessEntry' && {
          processentry: true,
        }),
      },
    }).then(() => {
      window.scrollTo(0, 0)
    })
  }, [activeSearchType, pathname, q, replace])

  const noUncategorized = (item) => {
    if (!item.category && filters.category === 'uncategorized') {
      return true
    }

    return !filters.category || filters.category === item.categorySlug
  }

  const filteredItems = [...searchResultsItems].filter(noUncategorized)
  const nothingFound = filteredItems.length === 0
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)
  const sidebarDataTypes = Object.entries(sidebarData.types)
  const sidebarDataTags = Object.entries(sidebarData.tags)

  const serviceCategoryItems = (sidebarDataTags ?? []).reduce(
    (all, [key, { title, total }]) => {
      const active = key === filters.category
      const text = `${title} (${total})`

      if (key === 'uncategorized') {
        return all
      }

      all.push({
        title: text,
        href: `${linkResolver('search').href}?q=${q}&category=${key}`,
        active,
      })

      return all
    },
    [],
  )

  const hasFilters = sidebarDataTypes.length || serviceCategoryItems.length

  const items: NavigationItem[] = [
    {
      title: n('showAll', 'Sýna allt'),
      active: !filters.category && !filters.type,
      href: `${linkResolver('search').href}?q=${q}`,
    },
    {
      ...(serviceCategoryItems.length && {
        title: `${n('serviceCategories', 'Þjónustuflokkar')} (${
          sidebarData.totalTagCount
        })`,
        active: filters.type === 'webArticle,webSubArticle',
        href: `${
          linkResolver('search').href
        }?q=${q}&type=webArticle,webSubArticle`,
        accordion: true,
        items: serviceCategoryItems,
      }),
    },
    ...(sidebarDataTypes ?? []).map(([key, { title, total }]) => {
      const active = key === filters.type
      const text = `${title} (${total})`

      return {
        title: text,
        href: `${linkResolver('search').href}?q=${q}&type=${key}`,
        active,
      }
    }),
  ]

  const selectedTitle =
    sidebarData.tags[filters.category]?.title ??
    sidebarData.types[filters.type]?.title ??
    n('allCategories', 'Allir flokkar')

  const searchResultsText =
    totalSearchResults === 1
      ? (n('searchResult', 'leitarniðurstaða') as string).toLowerCase()
      : (n('searchResults', 'leitarniðurstöður') as string).toLowerCase()

  return (
    <>
      <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head>
      <SidebarLayout
        sidebarContent={
          !!hasFilters && (
            <Navigation
              title={n('filterResults', 'Sía niðurstöður')}
              label={n('filterResults', 'Sía niðurstöður')}
              baseId="search-navigation"
              colorScheme="purple"
              activeItemTitle={selectedTitle}
              items={items}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href}>{link}</NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      >
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs
            items={[
              {
                title: 'Ísland.is',
                href: '/',
              },
            ]}
            renderLink={(link) => {
              return (
                <NextLink {...linkResolver('homepage')} passHref>
                  {link}
                </NextLink>
              )
            }}
          />

          <SearchInput
            id="search_input_search_page"
            ref={searchRef}
            size="large"
            placeholder={n('inputSearchQuery', 'Sláðu inn leitarorð')}
            quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
            activeLocale={activeLocale}
            initialInputValue={q}
          />
          <Box width="full">
            <Inline space={1}>
              {countResults.total > 0 && (
                <Tag
                  variant="blue"
                  active={!activeSearchType}
                  onClick={() => setActiveSearchType('')}
                >
                  Allar tegundir
                </Tag>
              )}
              {tagsList
                .filter((x) => x.count > 0)
                .map(({ title, count, key }, index) => (
                  <Tag
                    key={index}
                    variant="blue"
                    active={activeSearchType === key}
                    onClick={() => setActiveSearchType(key)}
                  >
                    {title} ({count})
                  </Tag>
                ))}
              {countResults.processEntryCount > 0 && (
                <Tag
                  variant="blue"
                  active={activeSearchType === 'ArticlesWithProcessEntry'}
                  onClick={() =>
                    setActiveSearchType('ArticlesWithProcessEntry')
                  }
                >
                  {n('processEntry', 'Umsókn')} (
                  {countResults.processEntryCount})
                </Tag>
              )}
            </Inline>
          </Box>
          <Hidden above="sm">
            <Navigation
              title={n('filterResults', 'Sía niðurstöður')}
              label={n('filterResults', 'Sía niðurstöður')}
              baseId="search-navigation-mobile"
              colorScheme="purple"
              activeItemTitle={selectedTitle}
              items={items}
              isMenuDialog
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href}>{link}</NextLink>
                ) : (
                  link
                )
              }}
            />
          </Hidden>

          {nothingFound ? (
            <>
              {!!q && (
                <Text variant="intro" as="p">
                  {n(
                    'nothingFoundWhenSearchingFor',
                    'Ekkert fannst við leit á',
                  )}{' '}
                  <strong>{q}</strong>
                </Text>
              )}

              <Text variant="intro" as="p">
                {n('nothingFoundExtendedExplanation')}
              </Text>

              {q.length &&
              searchResultsItems.length === 0 &&
              activeLocale === 'is' ? (
                <EnglishResultsLink q={q} />
              ) : null}
            </>
          ) : (
            <Box marginBottom={2}>
              <Text variant="intro" as="p">
                {totalSearchResults} {searchResultsText}
              </Text>
            </Box>
          )}
        </Stack>
        <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
          <Stack space={2}>
            {filteredItems.map(
              ({ image, thumbnail, labels, parentTitle, ...rest }, index) => {
                const tags: Array<CardTagsProps> = []

                labels.forEach((label) => {
                  tags.push({
                    title: label,
                    tagProps: {
                      outlined: true,
                    },
                  })
                })

                return (
                  <Card
                    key={index}
                    tags={tags}
                    image={thumbnail ? thumbnail : image}
                    subTitle={parentTitle}
                    {...rest}
                  />
                )
              },
            )}{' '}
            {totalSearchResults > 0 && (
              <Box paddingTop={8}>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  renderLink={(page, className, children) => (
                    <Link
                      href={{
                        pathname: linkResolver('search').href,
                        query: { ...query, page },
                      }}
                    >
                      <span className={className}>{children}</span>
                    </Link>
                  )}
                />
              </Box>
            )}
          </Stack>
        </ColorSchemeContext.Provider>
      </SidebarLayout>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = single(query.q) || ''
  const category = single(query.category) || ''
  const processentry = single(query.processentry) || ''
  const type = single(query.type) || ''
  const page = Number(single(query.page)) || 1

  let tags = {}
  let countTag = {}

  if (category) {
    tags = { tags: [{ key: category, type: 'category' as SearchableTags }] }
  } else if (processentry) {
    tags = { tags: [{ key: 'true', type: 'processentry' as SearchableTags }] }
  } else {
    countTag = { countTag: 'category' as SearchableTags }
  }

  const allTypes = [
    'webArticle' as SearchableContentTypes,
    'webLifeEventPage' as SearchableContentTypes,
    'webAdgerdirPage' as SearchableContentTypes,
    'webSubArticle' as SearchableContentTypes,
    'webLink' as SearchableContentTypes,
    'webNews' as SearchableContentTypes,
    'webOrganizationSubpage' as SearchableContentTypes,
  ]

  let types

  const typeStrings = type.split(',') as SearchableContentTypes[]
  if (typeStrings.length > 1) {
    types = typeStrings
  } else if (type) {
    types = [type as SearchableContentTypes]
  } else {
    types = allTypes
  }

  const [
    {
      data: { searchResults },
    },
    {
      data: { searchResults: countResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSearchResultsDetailedQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types: allTypes,
          ...tags,
          ...countTag,
          countTypes: true,
          size: PERPAGE,
          page,
        },
      },
    }),
    apolloClient.query<GetSearchResultsNewsQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_COUNT_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          countTag: 'category' as SearchableTags,
          types: allTypes,
          countTypes: true,
          countProcessEntry: true,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Search',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  if (searchResults.items.length === 0 && page > 1) {
    throw new CustomNextError(404)
  }

  return {
    q: queryString,
    searchResults,
    countResults,
    namespace,
    showSearchInHeader: false,
    page,
  }
}

const firstLower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1)

const useReplace = (): NextRouter['replace'] => {
  const Router = useRouter()
  const routerRef = useRef(Router)

  routerRef.current = Router

  const [{ replace }] = useState<Pick<NextRouter, 'replace'>>({
    replace: (path) => routerRef.current.replace(path),
  })

  return replace
}

interface EnglishResultsLinkProps {
  q: string
}

const EnglishResultsLink: FC<EnglishResultsLinkProps> = ({ q }) => {
  const { linkResolver } = useLinkResolver()
  const [getCount, { data }] = useLazyQuery<
    GetSearchResultsTotalQuery,
    QuerySearchResultsArgs
  >(GET_SEARCH_RESULTS_TOTAL)

  useMemo(() => {
    getCount({
      variables: {
        query: {
          queryString: q,
          language: 'en' as ContentLanguage,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const total = data?.searchResults?.total ?? 0

  if (total > 0) {
    return (
      <LinkContext.Provider
        value={{
          linkRenderer: (href, children) => (
            <Link color="blue600" underline="normal" href={href}>
              {children}
            </Link>
          ),
        }}
      >
        <Text variant="intro" as="p">
          <a href={linkResolver('search', [], 'en').href + `?q=${q}`}>
            {total} niðurstöður
          </a>{' '}
          fundust á ensku.
        </Text>
      </LinkContext.Provider>
    )
  }

  return null
}

export default withMainLayout(Search, { showSearchInHeader: false })
