import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { NameIdentifierValuePair } from '../../lib/data-types'

interface Props {
  header?: string
  items: NameIdentifierValuePair[]
  showTotal?: boolean
  totalLabel?: string
}

export const NameValueTableField = ({
  header,
  items,
  showTotal = true,
  totalLabel = 'Samtals:',
}: Props) => {
  const total = items.reduce(
    (acc, item) => acc + parseInt(item.value.replace(/\./g, ''), 10),
    0,
  )

  return (
    <Box>
      {header && (
        <Box background="blue100" paddingY={2} paddingX={3}>
          <Text variant="h5">{header}</Text>
        </Box>
      )}
      {items.map((item, i) => (
        <Box
          key={i}
          display="flex"
          justifyContent="spaceBetween"
          paddingY={2}
          borderBottomWidth="standard"
          borderColor="blue200"
        >
          <Text>{item.name}</Text>
          <Text>{item.value}</Text>
        </Box>
      ))}
      {showTotal && (
        <Box paddingTop={2} display="flex" justifyContent="spaceBetween">
          <Text fontWeight="semiBold">{totalLabel}</Text>
          <Text fontWeight="semiBold">{total.toLocaleString('is-IS')}</Text>
        </Box>
      )}
    </Box>
  )
}
