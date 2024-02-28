import React from 'react'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { BorderAbove } from '@island.is/web/components'
import { TwoColumnText } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { webRichText } from '@island.is/web/utils/richText'

const columnSpan: SpanType = ['12/12', '12/12', '12/12', '6/12']

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const { activeLocale } = useI18n()

  const leftId = 'sliceLeftTitle-' + slice.id
  const rightId = 'sliceRightTitle-' + slice.id

  const sliceLabelIds = []

  if (slice.leftTitle) {
    sliceLabelIds.push(leftId)
  }
  if (slice.rightTitle) {
    sliceLabelIds.push(rightId)
  }

  const ariaLabelledBy = sliceLabelIds.join(' ')

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={ariaLabelledBy ? ariaLabelledBy : undefined}
    >
      <GridContainer>
        {slice.dividerOnTop && <BorderAbove />}
        <Box>
          <GridRow>
            <GridColumn span={columnSpan} hiddenBelow="lg">
              {slice.leftTitle && (
                <Text variant="h2" as="h2" id={leftId}>
                  <Hyphen>{slice.leftTitle}</Hyphen>
                </Text>
              )}
            </GridColumn>
            <GridColumn span={columnSpan} hiddenBelow="lg">
              {slice.rightTitle && (
                <Text variant="h2" as="h2" id={rightId}>
                  <Hyphen>{slice.rightTitle}</Hyphen>
                </Text>
              )}
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={columnSpan}>
              {slice.leftTitle && (
                <Hidden above="md">
                  <Text variant="h2" as="h2">
                    {slice.leftTitle}
                  </Text>
                </Hidden>
              )}
              {webRichText(
                slice.leftContent as SliceType[],
                undefined,
                activeLocale,
              )}
              {slice.leftLink && slice.leftLink.url && (
                <Link href={slice.leftLink.url}>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    type="button"
                    variant="text"
                  >
                    {slice.leftLink.text}
                  </Button>
                </Link>
              )}
            </GridColumn>
            <GridColumn span={columnSpan} paddingTop={[4, 4, 4, 0]}>
              {slice.rightTitle && (
                <Hidden above="md">
                  <Text variant="h2" as="h2">
                    {slice.rightTitle}
                  </Text>
                </Hidden>
              )}
              {webRichText(
                slice.rightContent as SliceType[],
                undefined,
                activeLocale,
              )}
              {slice.rightLink && slice.rightLink.url && (
                <Link href={slice.rightLink.url}>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    type="button"
                    variant="text"
                  >
                    {slice.rightLink.text}
                  </Button>
                </Link>
              )}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
