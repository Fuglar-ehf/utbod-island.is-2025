import { Box, Button, Divider, Inline, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { complaint, sharedFields } from '../../lib/messages'
import { YES, NO } from '../../shared'

interface Props {
  name: string
  address: string
  nationalId: string
  operatesWithinEurope: typeof YES | typeof NO
  countryOfOperation: string | undefined
  onEdit: () => void
  onRemove?: () => void
}

export const ComplaineeTable: FC<Props> = ({
  name,
  address,
  nationalId,
  operatesWithinEurope,
  countryOfOperation,
  onEdit,
  onRemove,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box border="standard" borderRadius="large" marginTop={3}>
      <Box padding={4}>
        <Text variant="h5">
          {formatMessage(complaint.labels.complaineeName)}
        </Text>
        <Text marginBottom={3}>{name}</Text>
        <Text variant="h5">
          {formatMessage(complaint.labels.complaineeNationalId)}
        </Text>
        <Text marginBottom={3}>{nationalId}</Text>
        <Text variant="h5">
          {formatMessage(complaint.labels.complaineeAddress)}
        </Text>
        <Text marginBottom={3}>{address}</Text>
        <Text variant="h5">
          {formatMessage(complaint.labels.complaineeOperatesWithinEurope)}
        </Text>
        <Text
          marginBottom={
            countryOfOperation && countryOfOperation.length > 0 ? 3 : 0
          }
        >
          {formatMessage(
            operatesWithinEurope === 'yes' ? sharedFields.yes : sharedFields.no,
          )}
        </Text>
        {countryOfOperation && countryOfOperation.length > 0 && (
          <>
            <Text variant="h5">
              {formatMessage(complaint.labels.complaineeCountryOfOperation)}
            </Text>
            <Text>{countryOfOperation}</Text>
          </>
        )}
      </Box>
      <Divider />
      <Box paddingTop={2} paddingBottom={3} paddingX={4}>
        <Inline space={3}>
          <Button
            variant="text"
            size="small"
            icon="pencil"
            iconType="outline"
            onClick={onEdit}
          >
            {formatMessage(sharedFields.edit)}
          </Button>
          {onRemove && (
            <Button
              variant="text"
              size="small"
              icon="removeCircle"
              iconType="outline"
              onClick={onRemove}
            >
              {formatMessage(sharedFields.remove)}
            </Button>
          )}
        </Inline>
      </Box>
    </Box>
  )
}
