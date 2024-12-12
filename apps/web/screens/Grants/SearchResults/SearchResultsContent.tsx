import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import format from 'date-fns/format'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { InfoCardWrapper } from '@island.is/web/components'
import { Grant } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { m } from '../messages'
import { generateStatusTag, parseStatus } from '../utils'

interface Props {
  grants?: Array<Grant>
  subheader?: React.ReactNode
  locale: Locale
}

export const SearchResultsContent = ({ grants, subheader, locale }: Props) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md
  const isTablet = width <= theme.breakpoints.lg && width > theme.breakpoints.md

  const [isGridLayout, setIsGridLayout] = useState(true)

  return (
    <>
      {!isMobile && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginBottom={3}
          marginRight={3}
        >
          <Text>{subheader}</Text>
          <Button
            variant="utility"
            icon={isGridLayout ? 'menu' : 'gridView'}
            iconType="filled"
            colorScheme="white"
            size="small"
            onClick={() => setIsGridLayout(!isGridLayout)}
          >
            {formatMessage(
              isGridLayout ? m.general.displayList : m.general.displayGrid,
            )}
          </Button>
        </Box>
      )}
      {grants?.length ? (
        <InfoCardWrapper
          columns={!isGridLayout ? 1 : 2}
          variant="detailed"
          cards={
            grants
              ?.map((grant) => {
                if (!grant || !grant.applicationId) {
                  return null
                }

                const status = parseStatus(grant, formatMessage, locale)

                return {
                  eyebrow: grant.fund?.title ?? grant.name ?? '',
                  subEyebrow: grant.fund?.parentOrganization?.title,
                  title: grant.name ?? '',
                  description: grant.description ?? '',
                  logo:
                    grant.fund?.featuredImage?.url ??
                    grant.fund?.parentOrganization?.logo?.url ??
                    '',
                  logoAlt:
                    grant.fund?.featuredImage?.title ??
                    grant.fund?.parentOrganization?.logo?.title ??
                    '',
                  tags: status.applicationStatus
                    ? [
                        generateStatusTag(
                          status.applicationStatus,
                          formatMessage,
                        ),
                      ].filter(isDefined)
                    : undefined,
                  link: {
                    label: formatMessage(m.general.seeMore),
                    href: linkResolver(
                      'styrkjatorggrant',
                      [grant?.applicationId ?? ''],
                      locale,
                    ).href,
                  },
                  detailLines: [
                    grant.dateFrom && grant.dateTo
                      ? {
                          icon: 'calendar' as const,
                          text: `${format(
                            new Date(grant.dateFrom),
                            'dd.MM.yyyy',
                          )} - ${format(new Date(grant.dateTo), 'dd.MM.yyyy')}`,
                        }
                      : null,
                    {
                      icon: 'time' as const,
                      //todo: fix when the text is ready
                      text: status.deadlineStatus,
                    },
                    grant.categoryTags
                      ? {
                          icon: 'informationCircle' as const,
                          text: grant.categoryTags
                            .map((ct) => ct.title)
                            .filter(isDefined)
                            .join(', '),
                        }
                      : undefined,
                  ].filter(isDefined),
                }
              })
              .filter(isDefined) ?? []
          }
        />
      ) : undefined}
      {!grants?.length && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          background="white"
          borderWidth="standard"
          borderRadius="lg"
          borderColor="blue200"
          flexDirection={['columnReverse', 'columnReverse', 'row']}
          columnGap={[2, 4, 8, 8, 20]}
          paddingY={[5, 8]}
          paddingX={[3, 3, 5, 10]}
          rowGap={[7, 7, 0]}
        >
          <Box display="flex" flexDirection="column" rowGap={1}>
            <Text variant={'h3'} as={'h3'} color="dark400">
              {formatMessage(m.search.noResultsFound)}
            </Text>
          </Box>
          {!(isTablet || isMobile) && (
            <img
              width="240"
              src="/assets/sofa.svg"
              alt={formatMessage(m.search.noResultsFound)}
            />
          )}
        </Box>
      )}
    </>
  )
}
