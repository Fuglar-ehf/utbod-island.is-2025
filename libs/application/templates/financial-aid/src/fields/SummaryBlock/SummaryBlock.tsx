import React from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'

interface Props {
  sectionTitle: string
  answer?: string
  editAction?(): void
}

const SummaryBlock = ({ sectionTitle, answer, editAction }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexStart"
      paddingY={[4, 4, 5]}
      borderTopWidth="standard"
      borderColor="blue300"
    >
      <Box>
        <Text fontWeight="semiBold">{sectionTitle}</Text>
        <Text>{answer}</Text>
      </Box>
      <Button
        icon="pencil"
        iconType="filled"
        variant="utility"
        onClick={editAction}
      >
        Breyta
      </Button>
    </Box>
  )
}

export default SummaryBlock
