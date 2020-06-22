/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import { withApollo } from '../../graphql'
import { Screen } from '../../types'
import { Sidebar, SearchInput, Card } from '@island.is/web/components'
import { selectOptions } from '@island.is/web/json'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  Divider,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  ContentLanguage,
  QueryGetNamespaceArgs,
  Query,
  QuerySearchResultsArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
} from '../queries'
import { useRouter } from 'next/router'

import * as styles from '../Category/Category.treat'

interface CategoryProps {
  q: string
  searchResults: Query['searchResults']
  namespace: Query['getNamespace']
}

const Search: Screen<CategoryProps> = ({ q, searchResults, namespace }) => {
  const { activeLocale } = useI18n()
  const Router = useRouter()
  const n = useNamespace(namespace)

  const filters = {
    category: Router.query.category,
  }

  const prefix = activeLocale === 'en' ? `/en` : ``
  const articlePath = activeLocale === 'en' ? 'article' : 'grein'
  const searchPath = activeLocale === 'en' ? 'search' : 'leit'

  const onSubmit = (inputValue, selectedOption) => {
    if (selectedOption) {
      return Router.push(
        `${prefix}/${articlePath}/[slug]`,
        `${prefix}/${articlePath}/${selectedOption.value}`,
      )
    }

    return Router.push({
      pathname: `${prefix}/${searchPath}`,
      query: { q: inputValue },
    })
  }

  const sidebarCategories = searchResults.items.reduce((all, cur) => {
    const key = cur.categorySlug

    const item = all.find((x) => x.key === key)

    if (!item) {
      all.push({
        key,
        total: 1,
        title: cur.category || '',
      })
    } else {
      item.total += 1
    }

    return all
  }, [])

  const items = searchResults.items.map((item) => {
    return {
      title: item.title,
      description: item.content,
      href: `${prefix}/${articlePath}/[slug]`,
      as: `${prefix}/${articlePath}/${item.slug}`,
      categorySlug: item.categorySlug,
      category: item.category,
      group: item.group,
    }
  })

  const onSelectCategory = (key: string) => {
    Router.replace({
      pathname: `${prefix}/${searchPath}`,
      query: { q, category: key },
    })
  }

  const byCategory = (item) =>
    !filters.category || filters.category === item.categorySlug

  const filteredItems = items.filter(byCategory)

  const categoryTitle = items.find((x) => x.categorySlug === filters.category)
    ?.category

  return (
    <ContentBlock>
      <Box padding={[0, 0, 0, 6]}>
        <div className={styles.layout}>
          <div className={styles.side}>
            <Sidebar title={n('submenuTitle')}>
              <Filter
                selected={!filters.category}
                onClick={() => onSelectCategory(null)}
                text={`Allir flokkar (${searchResults.total})`}
              />
              <Divider weight="alternate" />
              {sidebarCategories.map((c, index) => {
                const selected = c.key === filters.category
                const text = `${c.title} (${c.total})`

                return (
                  <Filter
                    key={index}
                    selected={selected}
                    onClick={() => onSelectCategory(c.key)}
                    text={text}
                  />
                )
              })}
            </Sidebar>
          </div>

          <Box paddingLeft={[0, 0, 0, 4]} width="full">
            <Box padding={[3, 3, 6, 0]}>
              <ContentBlock width="small">
                <Stack space={[3, 3, 4]}>
                  <Breadcrumbs>
                    <Link href="/">
                      <a>Ísland.is</a>
                    </Link>
                  </Breadcrumbs>
                  <SearchInput
                    activeLocale={activeLocale}
                    initialInputValue={q}
                    onSubmit={onSubmit}
                  />
                  <Hidden above="md">
                    <Select
                      label="Þjónustuflokkar"
                      placeholder="Flokkar"
                      options={selectOptions}
                      name="search"
                    />
                  </Hidden>
                  <Typography variant="intro" as="p">
                    {filteredItems.length} leitarniðurstöður{' '}
                    {filters.category && (
                      <>
                        í flokki
                        {categoryTitle ? (
                          <>
                            : <strong>{categoryTitle}</strong>
                          </>
                        ) : (
                          '.'
                        )}
                      </>
                    )}
                  </Typography>
                </Stack>
              </ContentBlock>
            </Box>
            <div className={styles.bg}>
              <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
                <ContentBlock width="small">
                  <Stack space={2}>
                    {filteredItems.map((item, index) => {
                      return (
                        <Card
                          key={index}
                          title={item.title}
                          {...item}
                          tags={false}
                        />
                      )
                    })}
                  </Stack>
                </ContentBlock>
              </Box>
            </div>
          </Box>
        </div>
      </Box>
    </ContentBlock>
  )
}

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = (query.q as string) || ''

  const [
    {
      data: { searchResults },
    },
    {
      data: { getNamespace: namespace },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          queryString: queryString ? `${queryString}*` : '',
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Articles',
          lang: locale,
        },
      },
    }),
  ])

  return {
    q: queryString,
    searchResults,
    namespace,
  }
}

const Filter = ({ selected, text, onClick, ...props }) => {
  return (
    <Box
      component="button"
      type="button"
      textAlign="left"
      outline="none"
      onClick={onClick}
      {...props}
    >
      <Typography variant="p" as="span">
        {selected ? <strong>{text}</strong> : text}
      </Typography>
    </Box>
  )
}
export default withApollo(Search)
