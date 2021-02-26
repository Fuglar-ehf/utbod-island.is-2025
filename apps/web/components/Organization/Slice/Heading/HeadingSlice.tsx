import React from 'react'
import { HeadingSlice as HeadlingSliceSchema } from '@island.is/web/graphql/schema'
import { Box } from '@island.is/island-ui/core'
import { Heading } from '@island.is/web/components'

interface SliceProps {
  slice: HeadlingSliceSchema
}

export const HeadingSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id}>
      <Box paddingTop={[8, 6, 15]} paddingBottom={[4, 5, 10]}>
        <Heading {...slice} />
      </Box>
    </section>
  )
}
