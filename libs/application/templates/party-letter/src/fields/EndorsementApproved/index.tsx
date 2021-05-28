import React from 'react'
import { Box, Button, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Approved } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'

const EndorsementApproved = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={5} marginBottom={12}>
        <Approved
          title={formatMessage(m.endorsementApproved.cardTitle)}
          subtitle={formatMessage(m.endorsementApproved.cardSubtitle)}
        />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Button variant="ghost">
          <Link href={formatMessage(m.endorsementApproved.myPagesUrl)}>
            {formatMessage(m.endorsementApproved.myPagesButton)}
          </Link>
        </Button>

        <Box>
          <Button variant="text" icon="arrowForward" iconType="filled">
            <Link href={formatMessage(m.endorsementApproved.partyListUrl)}>
              {formatMessage(m.endorsementApproved.partyListButton)}
            </Link>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EndorsementApproved
