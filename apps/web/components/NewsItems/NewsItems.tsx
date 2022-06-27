import React from 'react'
import {
  Box,
  Text,
  Button,
  Hidden,
  Link,
  GridContainer,
} from '@island.is/island-ui/core'
import { GridItems } from '@island.is/web/components'
import { GetNewsQuery } from '@island.is/web/graphql/schema'
import cn from 'classnames'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import Item from './Item'
import * as styles from './NewsItems.css'

interface NewsItemsProps {
  heading: string
  headingTitle: string
  seeMoreText: string
  items: GetNewsQuery['getNews']['items']
  linkType?: LinkType
  overview?: LinkType
  parameters?: Array<string>
  seeMoreHref?: string

  // This boolean value can be used to forcefully add horizontal padding to the title section
  // This is useful if the NewsItems component is nested inside a GridContainer but we still want title section padding
  forceTitleSectionHorizontalPadding?: boolean
}

export const NewsItems = ({
  heading,
  headingTitle,
  seeMoreText,
  items = [],
  linkType,
  overview = 'newsoverview',
  parameters = [],
  seeMoreHref,
  forceTitleSectionHorizontalPadding = false,
}: NewsItemsProps) => {
  const { linkResolver } = useLinkResolver()

  const linkProps = seeMoreHref
    ? { href: seeMoreHref }
    : linkResolver(overview, parameters)

  // Stop wrapping title section with GridContainer if we force the horizontal padding
  // This is done so we don't get double padding by accident
  const TitleSectionWrapper = forceTitleSectionHorizontalPadding
    ? Box
    : GridContainer

  return (
    <>
      <TitleSectionWrapper>
        <Box
          className={cn({
            [styles.container]: forceTitleSectionHorizontalPadding,
          })}
        >
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="h3" as="h2" id={headingTitle} dataTestId="home-news">
              {heading}
            </Text>
            <Box display={['none', 'none', 'none', 'block']}>
              <Link {...linkProps} skipTab>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                >
                  {seeMoreText}
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </TitleSectionWrapper>

      <GridItems
        mobileItemsRows={1}
        mobileItemWidth={270}
        paddingTop={3}
        paddingBottom={3}
        insideGridContainer
        half
      >
        {items
          .slice(0, 2)
          .map(
            (
              { __typename: tn, title, intro, image, slug, date, genericTags },
              index,
            ) => (
              <Item
                key={index}
                date={date}
                heading={title}
                text={intro}
                href={
                  linkResolver(linkType ?? (tn as LinkType), [
                    ...parameters,
                    slug,
                  ]).href
                }
                image={image}
                tags={genericTags.map(({ slug, title, __typename: tn }) => {
                  return {
                    label: title,
                    href: linkResolver(linkType ?? (tn as LinkType), [
                      ...parameters,
                      slug,
                    ]).href,
                  }
                })}
              />
            ),
          )}
      </GridItems>
      <Hidden above="md">
        <GridContainer>
          <Box
            display="flex"
            width="full"
            justifyContent="center"
            alignItems="center"
          >
            <Link {...linkProps} skipTab>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {seeMoreText}
              </Button>
            </Link>
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default NewsItems
