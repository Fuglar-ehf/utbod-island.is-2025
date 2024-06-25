import React, { FC, PropsWithChildren } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

const PageTitle: FC<PropsWithChildren> = ({ children }) => (
  <Box marginBottom={7}>
    <Text as="h1" variant="h1">
      {children}
    </Text>
  </Box>
)

export default PageTitle
