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
import {
  lightThemes,
  OrganizationSlice,
  OrganizationWrapper,
  SliceDropdown,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { Namespace } from '@island.is/api/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { richText, SliceType } from '@island.is/island-ui/contentful'

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
      fullWidthContent={true}
      pageFeaturedImage={
        subpage.featuredImage ?? organizationPage.featuredImage
      }
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
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <GridContainer>
        <Box paddingY={4}>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <GridContainer>
                <GridRow>
                  <GridColumn
                    span={[
                      '12/12',
                      '12/12',
                      subpage.links.length ? '7/12' : '12/12',
                    ]}
                  >
                    <Box marginBottom={2}>
                      <Text variant="h1" as="h2">
                        {subpage.title}
                      </Text>
                    </Box>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn
                    span={[
                      '12/12',
                      '12/12',
                      subpage.links.length ? '7/12' : '12/12',
                    ]}
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
              </GridContainer>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
      {renderSlices(
        subpage.slices,
        subpage.sliceCustomRenderer,
        subpage.sliceExtraText,
        namespace,
        organizationPage.slug,
      )}
    </OrganizationWrapper>
  )
}

const renderSlices = (
  slices: Slice[],
  renderType: string,
  extraText: string,
  namespace: Namespace,
  organizationPageSlug: string,
) => {
  switch (renderType) {
    case 'SliceDropdown':
      return <SliceDropdown slices={slices} sliceExtraText={extraText} />
    default:
      return slices.map((slice) => (
        <OrganizationSlice
          key={slice.id}
          slice={slice}
          namespace={namespace}
          organizationPageSlug={organizationPageSlug}
        />
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
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: query.slug as string,
          slug: query.subSlug as string,
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

  const lightTheme = lightThemes.includes(getOrganizationPage.theme)

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
    ...(lightTheme ? {} : { darkTheme: true }),
  }
}

export default withMainLayout(SubPage)
