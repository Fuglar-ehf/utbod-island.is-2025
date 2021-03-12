import React from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  Breadcrumbs,
  Stack,
  Text,
  Box,
  Navigation,
  GridColumn,
  GridRow,
  Link,
  Button,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { Document } from '@contentful/rich-text-types'
import { GET_GENERIC_OVERVIEW_PAGE_QUERY } from '@island.is/web/screens/queries'
import {
  GetGenericOverviewPageQuery,
  QueryGetGenericOverviewPageArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'
import {
  Image,
  Slice as SliceType,
  richText,
} from '@island.is/island-ui/contentful'

interface GenericOverviewProps {
  genericOverviewPage: GetGenericOverviewPageQuery['getGenericOverviewPage']
}

export const GenericOverview: Screen<GenericOverviewProps> = ({
  genericOverviewPage: { title, intro, navigation, overviewLinks },
}) => {
  const { linkResolver } = useLinkResolver()

  const renderNavigation = (isMobile: boolean) => {
    return (
      <Navigation
        baseId={isMobile ? 'mobileNav' : 'desktopNav'}
        isMenuDialog={isMobile}
        activeItemTitle={navigation.title}
        title={navigation.title}
        items={[
          ...navigation.menuLinks.map((item) => ({
            title: item.title,
            typename: item.link.type,
            slug: [item.link.slug],
          })),
        ]}
        renderLink={(link, { typename, slug }) => {
          return (
            <Link {...linkResolver(typename as LinkType, slug)}>{link}</Link>
          )
        }}
      />
    )
  }

  return (
    <SidebarLayout sidebarContent={renderNavigation(false)}>
      <Stack space={2}>
        <Box display={['none', 'none', 'inlineBlock']}>
          <Breadcrumbs
            items={[
              {
                title: 'Ísland.is',
                href: '/',
              },
              {
                title: navigation.title,
              },
            ]}
          />
        </Box>
        <Box display={['block', 'block', 'none']}>{renderNavigation(true)}</Box>
        <Text variant="h1" as="h1">
          {title}
        </Text>
        {Boolean(intro) && (
          <Box marginBottom={[4, 6, 10]}>
            {richText(
              [
                {
                  __typename: 'Html',
                  id: intro.id,
                  document: intro.document,
                },
              ] as SliceType[],
              undefined,
            )}
          </Box>
        )}
      </Stack>
      <Stack space={6}>
        {overviewLinks.map(
          ({ title, linkTitle, link, image, leftImage, intro }, index) => {
            return (
              <GridRow key={index} direction={leftImage ? 'row' : 'rowReverse'}>
                <GridColumn span={['8/8', '3/8', '4/8', '3/8']}>
                  <Box
                    width="full"
                    position="relative"
                    paddingLeft={leftImage ? undefined : [0, 0, 0, 0, 6]}
                    paddingRight={leftImage ? [10, 0, 0, 0, 6] : [10, 0]}
                  >
                    <Image
                      url={image.url + '?w=774&fm=webp&q=80'}
                      thumbnail={image.url + '?w=50&fm=webp&q=80'}
                      {...image}
                    />
                  </Box>
                </GridColumn>
                <GridColumn span={['8/8', '5/8', '4/8', '5/8']}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    height="full"
                  >
                    <Box>
                      <Text variant="h2" marginBottom={2}>
                        {title}
                      </Text>
                      {Boolean(intro) && (
                        <Box marginBottom={4}>
                          {richText(
                            [
                              {
                                __typename: 'Html',
                                id: intro.id,
                                document: intro.document,
                              },
                            ] as SliceType[],
                            undefined,
                          )}{' '}
                        </Box>
                      )}
                      <Link
                        {...linkResolver(link.type as LinkType, [link.slug])}
                        skipTab
                      >
                        <Button icon="arrowForward" variant="text">
                          {linkTitle}
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </GridColumn>
              </GridRow>
            )
          },
        )}
      </Stack>
    </SidebarLayout>
  )
}

GenericOverview.getInitialProps = async ({
  apolloClient,
  locale,
  pathname,
}) => {
  const [
    {
      data: { getGenericOverviewPage: genericOverviewPage },
    },
  ] = await Promise.all([
    apolloClient.query<
      GetGenericOverviewPageQuery,
      QueryGetGenericOverviewPageArgs
    >({
      query: GET_GENERIC_OVERVIEW_PAGE_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          lang: locale,
          pageIdentifier: pathname.replace(/^.*\/(.*)$/, '$1'),
        },
      },
    }),
  ])

  if (!genericOverviewPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return { genericOverviewPage }
}

export default withMainLayout(GenericOverview)
