import React from 'react'

import { Box, Icon, Text, IconMapIcon } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

interface Props {
  icon: IconMapIcon
  iconColor: Colors
  message: string
}

const PoliceCaseFilesMessageBox: React.FC<Props> = (props) => {
  const { icon, iconColor, message } = props

  return (
    <Box display="flex" paddingY={2} paddingX={3} marginBottom={2}>
      <Box display="flex" marginRight={2}>
        <Icon icon={icon} color={iconColor} size="large" />
      </Box>
      <Text variant="h5">{message}</Text>
    </Box>
  )
}

export default PoliceCaseFilesMessageBox
