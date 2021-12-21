import React from 'react'
import {
  FocusableBox,
  Text,
  Box,
  Stack,
  Inline,
  Tag,
} from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { Image } from '@island.is/web/graphql/schema'

import * as styles from './Item.css'

type Tag = {
  label: string
  href?: string
}

type ItemProps = {
  heading: string
  date: string
  text: string
  href: string
  image?: Partial<Image>
  tags?: Tag[]
}

export const Item = ({
  heading,
  date,
  text,
  href,
  image,
  tags = [],
}: ItemProps) => {
  const hasTags = Array.isArray(tags) && tags.length > 0
  const { format } = useDateUtils()

  const formattedDate = format(new Date(date), 'do MMMM yyyy')

  return (
    <FocusableBox
      href={href}
      display="flex"
      flexDirection="column"
      paddingY={[2, 2, 3]}
      paddingX={[2, 2, 4]}
      background="white"
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      height="full"
      color="blue"
    >
      <span className={styles.wrapper}>
        <span className={styles.content}>
          <Box flexGrow={1} height="full">
            <Stack space={2}>
              <Text as="span" variant="eyebrow">
                {formattedDate}
              </Text>
              <Text as="h3" variant="h2" title={heading}>
                {heading}
              </Text>
              <Text>{text}</Text>
            </Stack>
          </Box>
          {hasTags && (
            <Box paddingTop={2} flexGrow={0}>
              <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
                {tags.map(({ label }) => (
                  <Tag key={label} variant="blue" truncate={true} disabled>
                    {label}
                  </Tag>
                ))}
              </Inline>
            </Box>
          )}
        </span>
        <Box
          marginLeft={[0, 0, 0, 0, 2]}
          marginBottom={[2, 2, 2, 2, 0]}
          className={styles.image}
        >
          <BackgroundImage
            width={600}
            quality={60}
            positionX="left"
            backgroundSize="cover"
            ratio="1:1"
            thumbnailColor="blue100"
            image={{
              url: image.url,
              title: image.title,
            }}
          />
        </Box>
      </span>
    </FocusableBox>
  )
}

export default Item
