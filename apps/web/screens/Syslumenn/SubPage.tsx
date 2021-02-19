/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  NavigationItem,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
  Slice,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { Namespace } from '@island.is/api/schema'
import dynamic from 'next/dynamic'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { richText, SliceType } from '@island.is/island-ui/contentful'

const OrganizationSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OrganizationSlice),
)
const SliceDropdown = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.SliceDropdown),
)

const { publicRuntimeConfig } = getConfig()

interface SubPageProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Query['getNamespace']
}

const SubPage: Screen<SubPageProps> = ({
  organizationPage,
  subpage,
  namespace,
}) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  useContentfulId(organizationPage.id)

  const pageUrl = `/stofnanir/${organizationPage.slug}/${subpage.slug}`
  const parentSubpageUrl = `/stofnanir/${organizationPage.slug}/${subpage.parentSubpage}`

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url === pageUrl ||
        childrenLinks.some((link) => link.url === pageUrl) ||
        childrenLinks.some((link) => link.url === parentSubpageUrl),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === pageUrl || url === parentSubpageUrl,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      pageTitle={subpage.title}
      organizationPage={organizationPage}
      pageFeaturedImage={
        subpage.featuredImage ?? organizationPage.featuredImage
      }
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: n('organizations', 'Stofnanir'),
          href: linkResolver('organizations').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      fullWidthContent={true}
    >
      <GridContainer>
        <Box paddingTop={[4, 4, 0]} paddingBottom={[4, 4, 6]}>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', subpage.links.length ? '7/12' : '12/12']}
            >
              <Box marginBottom={6}>
                <Text variant="h1" as="h2">
                  {subpage.title}
                </Text>
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', subpage.links.length ? '7/12' : '12/12']}
            >
              {richText(subpage.description as SliceType[])}
            </GridColumn>
            {subpage.links.length > 0 && (
              <GridColumn
                span={['12/12', '12/12', '4/12']}
                offset={[null, null, '1/12']}
              >
                <Stack space={2}>
                  {subpage.links.map((link) => (
                    <Link href={link.url} underline="small">
                      <Text fontWeight="light" color="blue400">
                        {link.text}
                      </Text>
                    </Link>
                  ))}
                </Stack>
              </GridColumn>
            )}
          </GridRow>
        </Box>
      </GridContainer>
      {renderSlices(
        subpage.slices,
        subpage.sliceCustomRenderer,
        subpage.sliceExtraText,
        namespace,
      )}
    </OrganizationWrapper>
  )
}

const renderSlices = (
  slices: Slice[],
  renderType: string,
  extraText: string,
  namespace: Namespace,
) => {
  switch (renderType) {
    case 'SliceDropdown':
      return <SliceDropdown slices={slices} sliceExtraText={extraText} />
    default:
      return slices.map((slice) => (
        <OrganizationSlice key={slice.id} slice={slice} namespace={namespace} />
      ))
  }
}

SubPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'syslumenn',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: 'syslumenn',
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Syslumenn',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(SubPage, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
