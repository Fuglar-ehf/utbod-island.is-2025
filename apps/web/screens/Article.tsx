import React, {
  FC,
  useState,
  useMemo,
  ReactNode,
  Fragment,
  useEffect,
} from 'react'
import { useFirstMountState } from 'react-use'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { BLOCKS } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Hidden,
  GridColumn,
  GridRow,
  Tag,
  Divider,
  Link,
  Icon,
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import {
  DrawerMenu,
  SidebarBox,
  Bullet,
  SidebarSubNav,
  RichText,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { ArticleLayout } from '@island.is/web/screens/Layouts/Layouts'
import { Screen } from '@island.is/web/types'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  AllSlicesFragment as Slice,
  AllSlicesProcessEntryFragment as ProcessEntry,
  GetSingleArticleQuery,
  QueryGetSingleArticleArgs,
} from '@island.is/web/graphql/schema'
import { createNavigation } from '@island.is/web/utils/navigation'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import useContentfulId from '@island.is/web/hooks/useContentfulId'

type Article = GetSingleArticleQuery['getSingleArticle']
type SubArticle = GetSingleArticleQuery['getSingleArticle']['subArticles'][0]

const maybeBold = (content: ReactNode, condition: boolean): ReactNode =>
  condition ? <b>{content}</b> : content

const createSubArticleNavigation = (body: Slice[]) => {
  // on sub-article page the main article title is h1, sub-article title is h2
  // and navigation is generated from h3
  const navigation = createNavigation(body, {
    htmlTags: [BLOCKS.HEADING_3],
  })

  // we'll hide sub-article navigation if it's only one item
  return navigation.length > 1 ? navigation : []
}

const createArticleNavigation = (
  article: Article,
  selectedSubArticle: SubArticle,
  makePath: (t: string, p: string) => string,
): Array<{ url: string; title: string }> => {
  if (article.subArticles.length === 0) {
    return createNavigation(article.body).map(({ id, text }) => ({
      title: text,
      url: article.slug + '#' + id,
    }))
  }

  let nav = []

  nav.push({
    title: article.title,
    url: makePath('article', '[slug]'),
    as: makePath('article', article.slug),
  })

  for (const subArticle of article.subArticles) {
    nav.push({
      title: subArticle.title,
      url: makePath('article', '[slug]/[subSlug]'),
      as: makePath('article', `${article.slug}/${subArticle.slug}`),
    })

    // expand sub-article navigation for selected sub-article
    // TODO: we need to style these differently in the mobile drawer
    if (subArticle === selectedSubArticle) {
      nav = nav.concat(
        createSubArticleNavigation(subArticle.body).map(({ id, text }) => ({
          title: text,
          url: article.slug + '#' + id,
        })),
      )
    }
  }

  return nav
}

const RelatedArticles: FC<{
  title: string
  articles: Array<{ slug: string; title: string }>
}> = ({ title, articles }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  if (articles.length === 0) return null

  return (
    <SidebarBox>
      <Stack space={[1, 1, 2]}>
        <Text variant="h4" as="h2">
          {title}
        </Text>
        <Divider weight="alternate" />
        {articles.map((article) => (
          <Text key={article.slug} as="span">
            <Link
              key={article.slug}
              href={makePath('article', '[slug]')}
              as={makePath('article', article.slug)}
              underline="normal"
            >
              {article.title}
            </Link>
          </Text>
        ))}
      </Stack>
    </SidebarBox>
  )
}

const ActionButton: FC<{ content: Slice[]; defaultText: string }> = ({
  content,
  defaultText,
}) => {
  const processEntries = content.filter((slice): slice is ProcessEntry => {
    return slice.__typename === 'ProcessEntry' && Boolean(slice.processLink)
  })

  // we'll only show the button if there is exactly one process entry on the page
  if (processEntries.length !== 1) return null

  const { buttonText, processLink } = processEntries[0]

  return (
    <SidebarBox>
      <Button href={processLink} width="fluid">
        {buttonText || defaultText}
      </Button>
    </SidebarBox>
  )
}

const SubArticleNavigation: FC<{
  title: string
  article: Article
  selectedSubArticle: SubArticle
}> = ({ title, article, selectedSubArticle }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const [bullet, setBullet] = useState<HTMLDivElement>(null)
  const isFirstMount = useFirstMountState()
  const navigation = useMemo(() => {
    return createSubArticleNavigation(selectedSubArticle?.body ?? [])
  }, [selectedSubArticle])

  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids)

  return (
    <SidebarBox position="relative">
      {/*
        first render sets the bullet ref, which means we don't know on first render
        where to show the bullet. When navigating between sub-articles there
        is also one render call with bullet=null, but in that case we don't
        want to remove the bullet element because we'd lose the movement animation
      */}
      {!isFirstMount && <Bullet align="left" top={bullet?.offsetTop ?? 0} />}

      <Stack space={[1, 1, 2]}>
        <Text variant="h4" as="h4">
          {title}
        </Text>
        <Divider weight="alternate" />
        <div ref={!selectedSubArticle ? setBullet : null}>
          <Link
            shallow
            href={makePath('article', '[slug]')}
            as={makePath('article', article.slug)}
          >
            <Text>
              {maybeBold(
                article.shortTitle || article.title,
                !selectedSubArticle,
              )}
            </Text>
          </Link>
        </div>
        {article.subArticles.map((subArticle, id) => (
          <Fragment key={id}>
            <div
              ref={
                subArticle === selectedSubArticle && navigation.length === 0
                  ? setBullet
                  : null
              }
            >
              <Link
                shallow
                href={makePath('article', '[slug]/[subSlug]')}
                as={makePath('article', `${article.slug}/${subArticle.slug}`)}
              >
                <Text as="span">
                  {maybeBold(
                    subArticle.title,
                    subArticle === selectedSubArticle,
                  )}
                </Text>
              </Link>
            </div>
            {subArticle === selectedSubArticle && navigation.length > 0 && (
              <SidebarSubNav>
                <Stack space={1}>
                  {navigation.map(({ id, text }) => (
                    <div key={id} ref={id === activeId ? setBullet : null}>
                      <Box
                        component="button"
                        type="button"
                        textAlign="left"
                        onClick={() => navigate(id)}
                      >
                        <Text variant="small">
                          {maybeBold(text, id === activeId)}
                        </Text>
                      </Box>
                    </div>
                  ))}
                </Stack>
              </SidebarSubNav>
            )}
          </Fragment>
        ))}
      </Stack>
    </SidebarBox>
  )
}

const ArticleNavigation: FC<{ title: string; article: Article }> = ({
  title,
  article,
}) => {
  const [bullet, setBullet] = useState<HTMLElement>(null)

  const navigation = useMemo(() => {
    return createNavigation(article.body, {
      title: article.shortTitle || article.title,
    })
  }, [article])

  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids)

  return (
    <SidebarBox position="relative">
      {bullet && <Bullet align="left" top={bullet.offsetTop} />}

      <Stack space={[1, 1, 2]}>
        <Text variant="h4" as="h2">
          {title}
        </Text>
        <Divider weight="alternate" />

        {navigation.map(({ id, text }) => (
          <Box
            ref={id === activeId ? setBullet : null}
            key={id}
            component="button"
            type="button"
            textAlign="left"
            onClick={() => navigate(id)}
          >
            <Text>{id === activeId ? <strong>{text}</strong> : text}</Text>
          </Box>
        ))}
      </Stack>
    </SidebarBox>
  )
}

interface ArticleSidebarProps {
  article: Article
  subArticle: SubArticle
  showActionButton: boolean
  n: (s: string) => string
}

const ArticleSidebar: FC<ArticleSidebarProps> = ({
  article,
  subArticle,
  showActionButton,
  n,
}) => {
  return (
    <Stack space={3}>
      {!!showActionButton && (
        <ActionButton
          content={article.body}
          defaultText={n('processLinkButtonText')}
        />
      )}
      {article.subArticles.length === 0 ? (
        <ArticleNavigation title="Efnisyfirlit" article={article} />
      ) : (
        <SubArticleNavigation
          title="Efnisyfirlit"
          article={article}
          selectedSubArticle={subArticle}
        />
      )}
      <RelatedArticles
        title={n('relatedMaterial')}
        articles={article.relatedArticles}
      />
    </Stack>
  )
}

export interface ArticleProps {
  article: Article
  namespace: GetNamespaceQuery['getNamespace']
}

const ArticleScreen: Screen<ArticleProps> = ({ article, namespace }) => {
  useContentfulId(article.id)
  const n = useNamespace(namespace)
  const { query } = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const subArticle = article.subArticles.find((sub) => {
    return sub.slug === query.subSlug
  })

  const contentOverviewOptions = useMemo(() => {
    return createArticleNavigation(article, subArticle, makePath)
  }, [article, subArticle, makePath])

  const metaTitle = `${article.title} | Ísland.is`
  const metaDescription =
    article.intro ||
    'Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt.'

  const processEntries = article?.body?.length
    ? article.body.filter((x) => x.__typename === 'ProcessEntry')
    : []

  // tmp fix
  const processEntry =
    processEntries.length === 1 ? (processEntries[0] as ProcessEntry) : null

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="title" property="og:title" content={metaTitle} />
        <meta
          name="description"
          property="og:description"
          content={metaDescription}
        />
      </Head>
      <ArticleLayout
        sidebar={
          <ArticleSidebar
            showActionButton={Boolean(processEntry)}
            article={article}
            subArticle={subArticle}
            n={n}
          />
        }
      >
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
            paddingBottom={2}
          >
            <Breadcrumbs>
              <Link href={makePath()}>Ísland.is</Link>
              {!!article.category && (
                <Link
                  href={makePath('ArticleCategory', '/[slug]')}
                  as={makePath('ArticleCategory', article.category.slug)}
                >
                  {article.category.title}
                </Link>
              )}
              {!!article.group && (
                <Link
                  as={makePath(
                    'ArticleCategory',
                    article.category.slug +
                      (article.group?.slug ? `#${article.group.slug}` : ''),
                  )}
                  href={makePath('ArticleCategory', '[slug]')}
                >
                  <Tag variant="blue">{article.group.title}</Tag>
                </Link>
              )}
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        {!!contentOverviewOptions.length && (
          <GridRow>
            <GridColumn span="9/9" paddingBottom={4}>
              <Hidden above="sm">
                <DrawerMenu
                  categories={[
                    {
                      title: n('categoryOverview', 'Efnisyfirlit'),
                      items: contentOverviewOptions,
                    },
                  ]}
                />
              </Hidden>
            </GridColumn>
          </GridRow>
        )}
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
          >
            <Text variant="h1" as="h1">
              <span id={slugify(article.title)}>{article.title}</span>
            </Text>
            {subArticle && (
              <Text variant="h2" as="h2" paddingTop={7}>
                <span id={slugify(subArticle.title)}>{subArticle.title}</span>
              </Text>
            )}
            {!!processEntry && (
              <Hidden above="sm">
                <Box
                  background="blue100"
                  padding={3}
                  marginY={3}
                  borderRadius="large"
                >
                  <Link
                    passHref
                    href={processEntry.processLink}
                    underline="normal"
                  >
                    <Text variant="h4" as="span" color="blue400">
                      <span>
                        {processEntry.buttonText || n('processLinkButtonText')}
                      </span>
                      <Box component="span" marginLeft={2}>
                        <Icon type="external" width="15" />
                      </Box>
                    </Text>
                  </Link>
                </Box>
              </Hidden>
            )}
          </GridColumn>
        </GridRow>
        <Box paddingTop={subArticle ? 2 : 4}>
          <RichText
            body={(subArticle ?? article).body}
            config={{ defaultPadding: 4 }}
          />
        </Box>
      </ArticleLayout>
    </>
  )
}

ArticleScreen.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string

  const [article, namespace] = await Promise.all([
    apolloClient
      .query<GetSingleArticleQuery, QueryGetSingleArticleArgs>({
        query: GET_ARTICLE_QUERY,
        variables: {
          input: {
            slug,
            lang: locale as string,
          },
        },
      })
      .then((response) => response.data.getSingleArticle),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
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

  // we assume 404 if no article/sub-article is found
  const subArticle = article?.subArticles.find((a) => a.slug === query.subSlug)
  if (!article || (query.subSlug && !subArticle)) {
    throw new CustomNextError(404, 'Article not found')
  }

  return {
    article,
    namespace,
  }
}

export default withMainLayout(ArticleScreen, { hasDrawerMenu: true })
