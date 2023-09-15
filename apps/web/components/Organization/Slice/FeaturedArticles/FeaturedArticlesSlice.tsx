import React from 'react'
import { FeaturedArticles } from '@island.is/web/graphql/schema'
import {
  Box,
  BoxProps,
  Button,
  FocusableBox,
  Link,
  Stack,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'

interface SliceProps {
  slice: FeaturedArticles
  namespace?: Record<string, string>
}

export const FeaturedArticlesSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice, namespace }) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const labelId = 'sliceTitle-' + slice.id

  const sortedArticles =
    slice.sortBy === 'importance'
      ? slice.resolvedArticles.slice().sort((a, b) => {
          if (
            typeof a.importance !== 'number' ||
            typeof b.importance !== 'number'
          ) {
            return a.title.localeCompare(b.title)
          }
          return a.importance > b.importance
            ? -1
            : a.importance === b.importance
            ? a.title.localeCompare(b.title)
            : 1
        })
      : slice.resolvedArticles

  const borderProps: BoxProps = slice.hasBorderAbove
    ? {
        borderTopWidth: 'standard',
        borderColor: 'standard',
        paddingTop: [8, 6, 8],
        paddingBottom: [8, 6, 6],
      }
    : {}

  return (
    (!!slice.articles.length || !!slice.resolvedArticles.length) && (
      <section key={slice.id} id={slice.id} aria-labelledby={labelId}>
        <Box {...borderProps}>
          <Text as="h2" variant="h3" paddingBottom={6} id={labelId}>
            {slice.title}
          </Text>
          <Stack space={2}>
            {(slice.automaticallyFetchArticles
              ? sortedArticles
              : slice.articles
            ).map(
              ({
                title,
                slug,
                processEntry = null,
                processEntryButtonText = null,
              }) => {
                const url = linkResolver('Article' as LinkType, [slug])
                return (
                  <FocusableBox key={slug} borderRadius="large" href={url.href}>
                    <TopicCard
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      tag={
                        (!!processEntry || processEntryButtonText) &&
                        n(processEntryButtonText || 'application', 'Umsókn')
                      }
                    >
                      {title}
                    </TopicCard>
                  </FocusableBox>
                )
              },
            )}
          </Stack>
          {!!slice.link && (
            <Box display="flex" justifyContent="flexEnd" paddingTop={6}>
              <Link href={slice.link.url}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  type="button"
                  variant="text"
                  as="span"
                >
                  {n('seeAllServices', 'Sjá allt efni')}
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </section>
    )
  )
}
