/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import slugify from '@sindresorhus/slugify'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  BoxProps,
  ResponsiveSpace,
  Option,
} from '@island.is/island-ui/core'
import {
  Sidebar,
  getHeadingLinkElements,
  Sleeve,
  Articles,
} from '@island.is/adgerdir/components'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPageArgs,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import {
  GET_ADGERDIR_PAGE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_TAGS_QUERY,
} from './queries'
import { ArticleLayout } from './Layouts/Layouts'
import { withApollo } from '../graphql'
import { Screen } from '../types'
import { Content } from '@island.is/island-ui/contentful'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
import { Locale } from '../i18n/I18n'
import useRouteNames from '../i18n/useRouteNames'
import { CustomNextError } from '../units/ErrorBoundary'
import { ColorSchemeContext } from '../context'

interface ArticleProps {
  article: Query['getAdgerdirPage']
  pages: Query['getAdgerdirPages']
  tags: Query['getAdgerdirTags']
  namespace: Query['getNamespace']
}

const simpleSpacing = [2, 2, 3] as ResponsiveSpace

const Article: Screen<ArticleProps> = ({ article, pages, tags, namespace }) => {
  const [contentOverviewOptions, setContentOverviewOptions] = useState([])
  const { activeLocale } = useI18n()
  // TODO: get language strings from namespace...
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale as Locale)

  // const { fields: articleFields } = article
  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  return (
    <>
      <Head>
        <title>{article.title} | Ísland.is</title>
      </Head>
      <ArticleLayout sidebar={<div>ok</div>}>
        <Stack space={3}>
          <Breadcrumbs color="blue400">
            <Link href={makePath()}>
              <a>Viðspyrna</a>
            </Link>
          </Breadcrumbs>
          <Box>
            <Typography variant="h1" as="h1">
              {article.title}
            </Typography>
          </Box>
        </Stack>
        <Content document={article.content} />
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box background="red100">
          <ContentBlock width="large">
            <Articles
              tags={tagsItems}
              items={pagesItems}
              currentArticle={article}
              showAll
            />
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
    </>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [
    {
      data: { getAdgerdirPage },
    },
    {
      data: { getAdgerdirPages },
    },
    {
      data: { getAdgerdirTags },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetAdgerdirPageArgs>({
      query: GET_ADGERDIR_PAGE_QUERY,
      variables: {
        input: {
          slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetAdgerdirPagesArgs>({
      query: GET_ADGERDIR_PAGES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetAdgerdirTagsArgs>({
      query: GET_ADGERDIR_TAGS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      .then((content) => {
        // map data here to reduce data processing in component
        return JSON.parse(content.data.getNamespace.fields)
      }),
  ])

  // we assume 404 if no article is found
  if (!getAdgerdirPage) {
    throw new CustomNextError(404, 'Article not found')
  }

  return {
    article: getAdgerdirPage,
    pages: getAdgerdirPages,
    tags: getAdgerdirTags,
    namespace,
  }
}

export default withApollo(Article)

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box padding={[3, 3, 6, 0]} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)

// TODO: Add fields for micro strings to article namespace
