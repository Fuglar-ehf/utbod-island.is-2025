import React, { FC, useContext } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Text,
  Tag,
  Inline,
  TagProps,
  FocusableBox,
  TagVariant,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { ColorSchemeContext } from '@island.is/web/context'
import { Image } from '@island.is/web/graphql/schema'
import { BackgroundImage } from '@island.is/web/components'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './Card.treat'

export type CardTagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  href?: string
  title: string
}

const tagPropsDefaults: Omit<TagProps, 'children'> = {
  variant: 'purple',
}

export interface CardProps {
  title: string
  image?: { title: string; url: string }
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  link?: LinkResolverResponse
  status?: string
}

export const Card: FC<CardProps> = ({
  title,
  image,
  description,
  tags = [],
  link,
  status,
}) => {
  const { colorScheme } = useContext(ColorSchemeContext)
  const [ref, { width }] = useMeasure()

  const stackImage = width < 360
  const isImage = image?.title.length > 0

  let borderColor = null
  let titleColor = null
  let tagVariant = 'purple' as TagVariant

  switch (colorScheme) {
    case 'red':
      borderColor = 'red200'
      titleColor = 'red600'
      tagVariant = 'red'
      break
    case 'blue':
      borderColor = 'blue200'
      titleColor = 'blue400'
      tagVariant = 'blue'
      break
    case 'purple':
      borderColor = 'purple200'
      titleColor = 'purple400'
      tagVariant = 'purple'
      break
    default:
      borderColor = 'purple200'
      titleColor = 'blue400'
      break
  }

  const items = (
    <Box ref={ref}>
      <GridRow direction={stackImage ? 'columnReverse' : 'row'}>
        <GridColumn key={1} span={isImage && !stackImage ? '8/12' : '12/12'}>
          <Stack space={1}>
            <Text as="h3" variant="h3" color={titleColor}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box display="inlineFlex" flexGrow={1}>
                  {title}
                </Box>
              </Box>
            </Text>
            {description && <Text>{description}</Text>}
            {tags.length > 0 && (
              <Box paddingTop={3} flexGrow={0} position="relative">
                <Inline space={1}>
                  {tags.map(
                    ({ title, href, ...props }: CardTagsProps, index) => {
                      const tagProps = {
                        ...tagPropsDefaults,
                        ...props.tagProps,
                        variant: tagVariant,
                      }

                      return href ? (
                        <Link key={index} {...link}>
                          <Tag {...tagProps}>{title}</Tag>
                        </Link>
                      ) : (
                        <Tag key={index} {...tagProps}>
                          {title}
                        </Tag>
                      )
                    },
                  )}
                </Inline>
              </Box>
            )}
          </Stack>
        </GridColumn>
        {isImage && (
          <GridColumn
            key={2}
            span={!stackImage ? '4/12' : '12/12'}
            position="relative"
          >
            <Box
              display="flex"
              width="full"
              marginTop={2}
              justifyContent="center"
              flexGrow={1}
              marginBottom={2}
              style={{ height: 200 }}
            >
              <BackgroundImage
                positionX={!stackImage ? 'right' : null}
                background="transparent"
                backgroundSize="contain"
                image={image}
              />
            </Box>
          </GridColumn>
        )}
      </GridRow>
    </Box>
  )

  if (link?.href) {
    return (
      <FocusableBox
        href={link.href}
        borderRadius="large"
        flexDirection="column"
        height="full"
        width="full"
        flexGrow={1}
        background="white"
        borderColor={borderColor}
        borderWidth="standard"
      >
        {status ? (
          <span
            className={cn(
              styles.status,
              styles.statusPosition,
              styles.statusType[status],
            )}
          ></span>
        ) : null}
        <Frame>{items}</Frame>
      </FocusableBox>
    )
  }

  return (
    <Frame>
      {status ? (
        <span
          className={cn(
            styles.status,
            styles.statusPosition,
            styles.statusType[status],
          )}
        ></span>
      ) : null}
      {items}
    </Frame>
  )
}

export const Frame = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="hidden"
      height="full"
      background="white"
      outline="none"
      padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default Card
