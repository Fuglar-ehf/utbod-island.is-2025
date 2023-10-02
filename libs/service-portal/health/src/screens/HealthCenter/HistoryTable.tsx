import { FC } from 'react'
import { RightsPortalHealthCenterRegistration } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { formatDate, m } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'

interface Props {
  history: Array<RightsPortalHealthCenterRegistration>
}

const HistoryTable: FC<Props> = ({ history }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <Box marginTop="containerGutter">
      <Text variant="h5" fontWeight="semiBold" paddingBottom={2}>
        {formatMessage(m.registrationHistory)}
      </Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.dateFromShort)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.dateToShort)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.healthCenter)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(messages.doctor)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {history.map((rowItem, index) => (
            <T.Row key={index}>
              <T.Data>
                <Text variant="medium">
                  {rowItem.dateFrom ? formatDate(rowItem.dateFrom) : '-'}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">
                  {rowItem.dateTo ? formatDate(rowItem.dateTo) : '-'}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">{rowItem.healthCenterName ?? '-'}</Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">{rowItem.doctor ?? '-'}</Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default HistoryTable
