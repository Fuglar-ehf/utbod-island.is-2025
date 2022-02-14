import React from 'react'
import { Text, GridContainer } from '@island.is/island-ui/core'
import { GridItems, IconTitleCard } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GetFrontpageQuery } from '@island.is/web/graphql/schema'

interface LifeEventsSectionProps {
  heading: string
  headingId: string
  items: GetFrontpageQuery['getFrontpage']['lifeEvents']
}

export const LifeEventsSection = ({
  heading,
  headingId,
  items = [],
}: LifeEventsSectionProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <GridContainer>
        <Text variant="h3" id={headingId}>
          {heading}
        </Text>
      </GridContainer>
      <GridItems
        mobileItemWidth={270}
        mobileItemsRows={2}
        paddingTop={3}
        paddingBottom={3}
        insideGridContainer
      >
        {items
          .filter((x) => x.slug && x.title)
          .map(
            (
              { __typename: typename, title, shortTitle, slug, tinyThumbnail },
              index,
            ) => {
              return (
                <IconTitleCard
                  key={index}
                  heading={shortTitle || title}
                  imgSrc={tinyThumbnail?.url}
                  alt={tinyThumbnail?.title}
                  href={linkResolver(typename as LinkType, [slug]).href}
                />
              )
            },
          )}
      </GridItems>
    </>
  )
}

export default LifeEventsSection
