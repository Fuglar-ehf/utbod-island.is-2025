import React from 'react'

import {
  Box,
  Columns,
  Column,
  IconDeprecated as Icon,
  Typography,
} from '@island.is/island-ui/core'

interface PropTypes {
  title?: string
  message?: string
}

function ErrorPanel({ title, message }: PropTypes) {
  return (
    <Box
      background="red100"
      padding={[2, 2, 3]}
      border="focus"
      borderRadius="large"
    >
      <Columns>
        <Column width="content">
          <Box marginRight={2} alignItems="center" display="flex">
            <Icon type="alert" color="red400" />
          </Box>
        </Column>
        <Column>
          <Box marginBottom={1}>
            <Typography variant="h4">{title}</Typography>
          </Box>
          <Typography variant="p">{message}</Typography>
        </Column>
      </Columns>
    </Box>
  )
}

export default ErrorPanel
