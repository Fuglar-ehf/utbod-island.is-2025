import React from 'react'
import { TwoColumnText } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[4, 4, 6]}
          paddingBottom={[4, 5, 10]}
        >
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={2}>
              <Text variant="h3" as="h2" id={'sliceTitle-' + slice.id}>
                {slice.leftTitle}
              </Text>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={2}>
              {slice.rightTitle && (
                <Text variant="h3" as="h2">
                  {slice.rightTitle}
                </Text>
              )}
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              {richText(slice.leftContent as SliceType[])}
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              {richText(slice.rightContent as SliceType[])}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
