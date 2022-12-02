import { useRouter } from 'next/router'
import { BreadCrumbItem, NavigationItem } from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from '@island.is/web/screens/queries'
import { withMainLayout } from '@island.is/web/layouts/main'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Query,
  QueryGetOrganizationPageArgs,
  OrganizationPage,
} from '@island.is/web/graphql/schema'
import {
  getThemeConfig,
  HeadWithSocialSharing,
  NewsArticle,
  OrganizationWrapper,
} from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import { CustomNextError } from '../../units/errors'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { Locale } from 'locale'

interface OrganizationNewsArticleProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  namespace: GetNamespaceQuery['getNamespace']
  organizationPage: OrganizationPage
  locale: Locale
}

const OrganizationNewsArticle: Screen<OrganizationNewsArticleProps> = ({
  newsItem,
  namespace,
  organizationPage,
  locale,
}) => {
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id, newsItem?.id)
  useLocalLinkTypeResolver()

  // We only display breadcrumbs and highlighted nav item if the news has the
  // primary news tag of the organization
  const newsHavePrimaryNewsTagOfOrganization = newsItem.genericTags.some(
    (x) => x.slug === organizationPage.newsTag.slug,
  )

  const overviewPath: string = router.asPath.substring(
    0,
    router.asPath.lastIndexOf('/'),
  )

  const currentNavItem = organizationPage.menuLinks.find(
    ({ primaryLink }) => primaryLink?.url === overviewPath,
  )

  const newsOverviewTitle: string = currentNavItem
    ? currentNavItem.primaryLink?.text
    : n('newsTitle', 'Fréttir og tilkynningar')

  const isNewsletter = newsItem?.genericTags?.some(
    (x) => x.slug === 'frettabref',
  )

  const newsletterTitle = newsItem?.genericTags?.find(
    (x) => x.slug === 'frettabref',
  )?.title

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
      typename: 'homepage',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug], locale)
        .href,
      typename: 'organizationpage',
    },
    ...(newsHavePrimaryNewsTagOfOrganization
      ? [
          {
            isTag: true,
            title: newsOverviewTitle,
            href: linkResolver('organizationnewsoverview', [
              organizationPage.slug,
            ]).href,
            typename: 'organizationnewsoverview',
          },
        ]
      : []),
    ...(isNewsletter
      ? [
          {
            isTag: true,
            title: newsletterTitle,
            href:
              linkResolver('organizationnewsoverview', [organizationPage.slug])
                .href + '?tag=frettabref',
            typename: 'organizationnewsoverview',
          },
        ]
      : []),
  ]

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        newsHavePrimaryNewsTagOfOrganization &&
        primaryLink?.url === overviewPath,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <>
      <OrganizationWrapper
        pageTitle={organizationPage.title}
        organizationPage={organizationPage}
        breadcrumbItems={breadCrumbs}
        navigationData={{
          title: n('navigationTitle', 'Efnisyfirlit'),
          items: navList,
        }}
      >
        <NewsArticle newsItem={newsItem} />
      </OrganizationWrapper>
      <HeadWithSocialSharing
        title={`${newsItem.title} | ${organizationPage.title}`}
        description={newsItem.intro}
        imageUrl={newsItem.image?.url}
        imageWidth={newsItem.image?.width.toString()}
        imageHeight={newsItem.image?.height.toString()}
      />
    </>
  )
}

OrganizationNewsArticle.getInitialProps = async ({
  apolloClient,
  locale,
  query,
}) => {
  const organizationPage = (
    await Promise.resolve(
      apolloClient.query<Query, QueryGetOrganizationPageArgs>({
        query: GET_ORGANIZATION_PAGE_QUERY,
        variables: {
          input: {
            slug: query.slug as string,
            lang: locale as Locale,
          },
        },
      }),
    )
  ).data?.getOrganizationPage

  if (!organizationPage) {
    throw new CustomNextError(
      404,
      `Could not find organization page with slug: ${query.slug}`,
    )
  }

  const [
    {
      data: { getSingleNews: newsItem },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSingleNewsItemQuery, QueryGetSingleNewsArgs>({
      query: GET_SINGLE_NEWS_ITEM_QUERY,
      variables: {
        input: {
          slug: query.newsSlug as string,
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
            namespace: 'Newspages',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  if (!newsItem) {
    throw new CustomNextError(404, 'News not found')
  }

  return {
    organizationPage: organizationPage,
    newsItem,
    namespace,
    locale: locale as Locale,
    ...getThemeConfig(organizationPage.theme, organizationPage.slug),
  }
}

export default withMainLayout(OrganizationNewsArticle)
