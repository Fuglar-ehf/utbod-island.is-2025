import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'

export type Individual = {
  name: string
  nationalId: string
  phone: string
  email: string
}

export const PaymentInfo: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="h2" marginBottom={3}>
        {formatMessage(m.payment)}
      </Text>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.maritalStatusCertificates)}</Text>
        <Text variant="h5">5.500 kr.</Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.birthCertificates)}</Text>
        <Text variant="h5">5.500 kr.</Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.surveyCertificate)}</Text>
        <Text variant="h5">4.500 kr.</Text>
      </Box>
      <Divider />
      <Box display="flex" paddingTop={3} justifyContent="spaceBetween">
        <Text variant="h3" color="blue400">
          {formatMessage(m.total)}
        </Text>
        <Text variant="h3" color="blue400">
          15.500 kr.
        </Text>
      </Box>
    </Box>
  )
}
