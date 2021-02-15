import React from 'react'
import { Box, Button, GridContainer, Text } from '@island.is/island-ui/core'
import { OneColumnText } from '@island.is/web/graphql/schema'
import Link from 'next/link'
import { richText, SliceType } from '@island.is/island-ui/contentful'

interface SliceProps {
  slice: OneColumnText
}

export const OneColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[4, 4, 6]}
          paddingBottom={[4, 5, 10]}
        >
          <Text
            variant="h3"
            as="h2"
            id={'sliceTitle-' + slice.id}
            paddingBottom={2}
          >
            {slice.title}
          </Text>
          {richText(slice.content as SliceType[])}
          {slice.link && (
            <Link href="#">
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
              >
                {slice.link.text}
              </Button>
            </Link>
          )}
        </Box>
      </GridContainer>
    </section>
  )
}
