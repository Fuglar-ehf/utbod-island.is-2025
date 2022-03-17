import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  Link,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../lib/constants'
import { useMutation } from '@apollo/client'
import { PropertyDetail } from '../../types/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const PendingRejected: FC<FieldBaseProps> = ({ application }) => {
  const { externalData } = application
  const { formatMessage } = useLocale()

  const [runEvent, setRunEvent] = useState<string | undefined>(undefined)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  useEffect(() => {
    document.title = 'Beiðni um vinnslu'
  }, [])

  const handleStateChange = (newRunEvent: string) => {
    if (runEvent !== newRunEvent) {
      setRunEvent(newRunEvent)

      submitApplication({
        variables: {
          input: {
            id: application.id,
            event: newRunEvent,
            answers: application.answers,
          },
        },
      })
    }
  }

  const { hasSentRequest } = externalData.submitRequestToSyslumenn?.data as {
    hasSentRequest: boolean
  }

  if (hasSentRequest) {
    handleStateChange(MCEvents.PENDING_REJECTED_TRY_AGAIN)
  }

  const { propertyDetails } = externalData.validateMortgageCertificate
    ?.data as {
    propertyDetails: PropertyDetail
  }

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        Upplýsingar um eign
      </Text>

      <Box
        borderRadius="standard"
        background={'blue100'}
        paddingX={2}
        paddingY={1}
        marginBottom={5}
      >
        <Text fontWeight="semiBold">Valin fasteign</Text>
        <Text>
          {propertyDetails?.propertyNumber}
          {' - '}
          {propertyDetails?.defaultAddress?.display}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="warning"
          title={formatMessage(m.propertyErrorCertificateTitle)}
          message={formatMessage(m.propertyErrorCertificateMessage)}
        />
      </Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(m.propertyErrorCertificateSheriffTitle)}
          message={formatMessage(m.propertyErrorCertificateSheriffMessage)}
        />
      </Box>
      <Box display="flex" justifyContent={'flexEnd'}>
        <Link href="https://minarsidur.island.is/">
          <Button variant="primary" icon="arrowForward">
            {formatMessage(m.mysites)}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
