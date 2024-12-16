import { useIntl } from 'react-intl'
import NextLink from 'next/link'

import {
  ArrowLink,
  Box,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantSearchSection } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTag,
  Query,
  QueryGetGenericTagsInTagGroupsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY } from '../../queries/GenericTag'
import { m } from '../messages'
import {
  CATEGORY_TAG_SLUGS,
  CategorySlug,
  mapTagToMessageId,
} from './mapTagToMessageId'

const GrantsHomePage: CustomScreen<GrantsHomeProps> = ({
  categories,
  locale,
  customPageData,
}) => {
  const intl = useIntl()
  const { linkResolver } = useLinkResolver()
  const { formatMessage } = intl

  const baseUrl = linkResolver('styrkjatorg', [], locale).href
  const searchUrl = linkResolver('styrkjatorgsearch', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  return (
    <Box>
      <Stack space={SLICE_SPACING}>
        <GrantSearchSection
          title={customPageData?.ogTitle ?? formatMessage(m.home.title)}
          description={
            customPageData?.ogDescription ?? formatMessage(m.home.description)
          }
          searchPlaceholder={formatMessage(m.home.inputPlaceholder)}
          searchUrl={searchUrl}
          shortcutsTitle={formatMessage(m.home.mostVisited)}
          featuredImage={
            customPageData?.ogImage?.url ?? formatMessage(m.home.featuredImage)
          }
          featuredImageAlt={formatMessage(m.home.featuredImageAlt)}
          //TODO - do when the categories are ready
          quickLinks={[
            {
              title: 'Listamannalaun',
              href: searchUrl + '?category=menning-og-listir',
            },
            {
              title: 'Barnamenningarsjóður',
              href: searchUrl + '?category=nam-og-kennsla',
            },
            {
              title: 'Tónlistarsjóður',
              href: searchUrl + '?category=nyskopun',
            },
            {
              title: 'Rannís',
              href: searchUrl + '?organization=rannis',
              variant: 'purple',
            },
            {
              title: 'Erasmus',
              href: searchUrl + '?organization=erasmus',
              variant: 'purple',
            },
          ]}
          breadcrumbs={
            breadcrumbItems && (
              <Breadcrumbs
                items={breadcrumbItems ?? []}
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href} legacyBehavior>
                      {link}
                    </NextLink>
                  ) : (
                    link
                  )
                }}
              />
            )
          }
        />

        <Box background="blue100" paddingTop={8} paddingBottom={8}>
          <GridContainer>
            <Box
              display={'flex'}
              justifyContent={'spaceBetween'}
              alignItems="flexEnd"
            >
              <Text variant="h3">
                {formatMessage(m.home.popularCategories)}
              </Text>
              <ArrowLink href={searchUrl}>
                {formatMessage(m.home.allGrants)}
              </ArrowLink>
            </Box>

            <GridRow>
              {categories?.map((c) => (
                <GridColumn
                  key={c.slug}
                  span={['1/1', '1/2', '1/2', '1/3']}
                  paddingTop={3}
                  paddingBottom={3}
                >
                  <CategoryCard
                    href={`${searchUrl}?category=${c.slug}`}
                    heading={c.title}
                    text={
                      CATEGORY_TAG_SLUGS.includes(c.slug as CategorySlug)
                        ? formatMessage(
                            mapTagToMessageId(c.slug as CategorySlug),
                          )
                        : ''
                    }
                  />
                </GridColumn>
              ))}
            </GridRow>
          </GridContainer>
        </Box>
      </Stack>
    </Box>
  )
}

interface GrantsHomeProps {
  organization?: Query['getOrganization']
  categories?: Array<GenericTag>
  locale: Locale
}

const GrantsHome: CustomScreen<GrantsHomeProps> = ({
  categories,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <GrantsHomePage
      categories={categories}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsHome.getProps = async ({ apolloClient, locale }) => {
  const tagGroupCategory = 'grant-category'
  //Todo: add more organizations ??

  const {
    data: { getGenericTagsInTagGroups: tags },
  } = await apolloClient.query<Query, QueryGetGenericTagsInTagGroupsArgs>({
    query: GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        tagGroupSlugs: [tagGroupCategory],
      },
    },
  })

  return {
    categories: tags ?? [],
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantsHome),
)
