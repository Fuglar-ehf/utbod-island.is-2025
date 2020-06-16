/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import { Card, Sidebar } from '../../components'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  AccordionCard,
  Select,
  LinkCard,
} from '@island.is/island-ui/core'

import { groups, selectOptions } from '../../json'

import * as styles from './Category.treat'
import { useI18n } from '@island.is/web/i18n'

import { withApollo } from '../../graphql'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ARTICLES_IN_CATEGORY_QUERY,
  GET_CATEGORIES_QUERY,
} from '../queries'
import {
  QueryGetNamespaceArgs,
  Query,
  ContentLanguage,
  QueryArticlesInCategoryArgs,
  QueryCategoriesArgs,
} from '@island.is/api/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useRouter } from 'next/router'

interface CategoryProps {
  articles: Query['articlesInCategory']
  categories: Query['categories']
  namespace: Query['getNamespace']
}

const Category: Screen<CategoryProps> = ({
  articles,
  categories,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const n = useNamespace(namespace)

  const prefix = activeLocale === 'en' ? `/en` : ``
  const articlePath = activeLocale === 'en' ? 'article' : 'grein'
  const categoryPath = activeLocale === 'en' ? 'category' : 'flokkur'

  const articleCards = articles.map(({ title, slug, content }) => ({
    title,
    description: content,
    href: `${prefix}/${articlePath}/${slug}`,
  }))

  const currentCategory = categories.find((x) => x.slug === router.query.slug)

  const DESCRIPTION =
    'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.'

  return (
    <ContentBlock>
      <Box padding={[0, 0, 0, 6]}>
        <div className={styles.layout}>
          <div className={styles.side}>
            <Sidebar title={n('submenuTitle')}>
              {categories.map((c, index) => (
                <Link key={index} href={`${prefix}/${categoryPath}/${c.slug}`}>
                  <a>
                    <Typography variant="p" as="span">
                      {c.title}
                    </Typography>
                  </a>
                </Link>
              ))}
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
                  <Hidden above="md">
                    <Select
                      label="Þjónustuflokkar"
                      placeholder="Flokkar"
                      options={selectOptions}
                      name="search"
                    />
                  </Hidden>
                  <Typography variant="h1" as="h1">
                    {currentCategory.title}
                  </Typography>
                  <Typography variant="intro" as="p">
                    {DESCRIPTION}
                  </Typography>
                </Stack>
              </ContentBlock>
            </Box>
            <div className={styles.bg}>
              <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
                <ContentBlock width="small">
                  <Stack space={2}>
                    <Stack space={2}>
                      {groups.map((group, index) => {
                        return (
                          <AccordionCard
                            key={index}
                            id={`accordion-${index}`}
                            label={group.title}
                            visibleContent={
                              <Box paddingY={2} paddingBottom={1}>
                                {group.description}
                              </Box>
                            }
                          >
                            <Stack space={2}>
                              {articles.map(({ title }, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={`${prefix}/${articlePath}/undanthaga-fra-afborgunum`}
                                    passHref
                                  >
                                    <LinkCard key={index}>{title}</LinkCard>
                                  </Link>
                                )
                              })}
                            </Stack>
                          </AccordionCard>
                        )
                      })}
                    </Stack>
                    <Stack space={2}>
                      {articleCards.map((article, index) => {
                        return <Card key={index} {...article} tags={false} />
                      })}
                    </Stack>
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

Category.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string

  const [
    {
      data: { articlesInCategory },
    },
    {
      data: { categories },
    },
    {
      data: { getNamespace: namespace },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryArticlesInCategoryArgs>({
      query: GET_ARTICLES_IN_CATEGORY_QUERY,
      variables: {
        category: {
          slug,
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryCategoriesArgs>({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Article',
          lang: locale,
        },
      },
    }),
  ])

  return {
    articles: articlesInCategory,
    categories,
    namespace,
  }
}

export default withApollo(Category)
