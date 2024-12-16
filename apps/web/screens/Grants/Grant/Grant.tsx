import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  ActionCard,
  AlertBanner,
  Box,
  Breadcrumbs,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Grant,
  Query,
  QueryGetSingleGrantArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_GRANT_QUERY } from '../../queries'
import { m } from '../messages'
import { generateStatusTag, parseStatus } from '../utils'
import { GrantSidebar } from './GrantSidebar'

const GrantSinglePage: CustomScreen<GrantSingleProps> = ({ grant, locale }) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const baseUrl = linkResolver('styrkjatorg', [], locale).href
  const searchUrl = linkResolver('styrkjatorgsearch', [], locale).href
  const currentUrl = linkResolver(
    'styrkjatorggrant',
    [grant?.applicationId ?? ''],
    locale,
  ).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: baseUrl,
    },
    {
      title: formatMessage(m.search.results),
      href: searchUrl,
    },
    {
      title: grant?.name ?? formatMessage(m.home.grant),
      href: currentUrl,
      isTag: true,
    },
  ]

  const status = useMemo(
    () => (grant ? parseStatus(grant, formatMessage, locale) : null),
    [grant, formatMessage, locale],
  )

  if (!grant) {
    return null
  }

  return (
    <GrantWrapper
      pageTitle={grant.name}
      pageDescription={grant?.description ?? ''}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <SidebarLayout
        sidebarContent={<GrantSidebar locale={locale} grant={grant} />}
      >
        <Stack space={4}>
          <Box>
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

            <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
              {grant.name}
            </Text>
            <Text variant="default">{grant.description}</Text>
          </Box>

          <ActionCard
            heading={grant.name}
            text={
              status
                ? generateStatusTag(status.applicationStatus, formatMessage)
                    ?.label +
                  (status.deadlineStatus ? ' / ' + status.deadlineStatus : '')
                : ''
            }
            backgroundColor="blue"
            cta={{
              disabled: !grant.applicationUrl?.slug,
              label:
                grant.applicationButtonLabel ?? formatMessage(m.single.apply),
              onClick: () => router.push(grant.applicationUrl?.slug ?? ''),
              icon: 'open',
              iconType: 'outline',
            }}
          />
          <AlertBanner description={status?.note} />
          {grant.specialEmphasis?.length ? (
            <>
              <Box className="rs_read">
                {webRichText(
                  grant.specialEmphasis as SliceType[],
                  undefined,
                  locale,
                )}
              </Box>
              <Divider />
            </>
          ) : undefined}
          {grant.whoCanApply?.length ? (
            <>
              <Box>
                <Text variant="h3">{formatMessage(m.single.whoCanApply)}</Text>
                <Box className="rs_read">
                  {webRichText(
                    grant.whoCanApply as SliceType[],
                    undefined,
                    locale,
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          ) : undefined}
          {grant.howToApply?.length ? (
            <>
              <Box>
                <Text variant="h3">{formatMessage(m.single.howToApply)}</Text>
                <Box className="rs_read">
                  {webRichText(
                    grant.howToApply as SliceType[],
                    undefined,
                    locale,
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          ) : undefined}

          {grant.applicationHints?.length ? (
            <Box className="rs_read">
              {webRichText(
                grant.applicationHints as SliceType[],
                undefined,
                locale,
              )}
            </Box>
          ) : undefined}
        </Stack>
      </SidebarLayout>
    </GrantWrapper>
  )
}

interface GrantSingleProps {
  grant?: Grant
  locale: Locale
}

const GrantSingle: CustomScreen<GrantSingleProps> = ({
  grant,
  customPageData,
  locale,
}) => {
  return (
    <GrantSinglePage
      grant={grant}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantSingle.getProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getSingleGrant: grant },
  } = await apolloClient.query<Query, QueryGetSingleGrantArgs>({
    query: GET_GRANT_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        id: String(query.id),
      },
    },
  })

  if (!grant) {
    throw new CustomNextError(404, 'Grant not found')
  }

  return {
    grant: grant ?? undefined,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantSingle),
)
