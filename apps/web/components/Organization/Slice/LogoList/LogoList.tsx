import React from 'react'
import { LogoListSlice as LogoListProps } from '@island.is/web/graphql/schema'
import { Box, GridContainer } from '@island.is/island-ui/core'
import { LogoList } from '../../../LogoList/LogoList'

interface SliceProps {
  slice: LogoListProps
}

export const LogoListSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box paddingTop={[8, 8, 12]} paddingBottom={4}>
          <LogoList
            {...slice}
            images={slice.images.map((img) => img.url)}
            variant="dark"
          />
        </Box>
      </GridContainer>
    </section>
  )
}
