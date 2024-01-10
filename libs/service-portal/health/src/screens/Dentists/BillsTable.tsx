import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  formatDate,
  amountFormat,
  DownloadFileButtons,
} from '@island.is/service-portal/core'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import { RightsPortalDentistBill } from '@island.is/api/schema'
import { exportDentistFile } from '../../utils/FileBreakdown'

interface Props {
  bills: Array<RightsPortalDentistBill>
}

type TotalBills = {
  totalCharge: number
  totalCovered: number
}

const BillsTable = ({ bills }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const totalBills = bills.reduce(
    (total, bill) => ({
      totalCharge: total.totalCharge + (bill.amount ?? 0),
      totalCovered: total.totalCovered + (bill.coveredAmount ?? 0),
    }),
    {
      totalCharge: 0,
      totalCovered: 0,
    } as TotalBills,
  )

  return (
    <Box marginTop="containerGutter">
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.number)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.date)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(messages.repaid)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(messages.dentistCharge)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="medium">
                {formatMessage(messages.amountRefundedByInsurance)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {bills.map((rowItem, index) => (
            <T.Row key={index}>
              <T.Data>
                <Text variant="medium">{rowItem.number}</Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">
                  {rowItem.date ? formatDate(rowItem.date) : ''}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">
                  {rowItem.refundDate ? formatDate(rowItem.refundDate) : ''}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">
                  {rowItem.amount ? amountFormat(rowItem.amount) : ''}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">
                  {rowItem.coveredAmount
                    ? amountFormat(rowItem.coveredAmount)
                    : ''}
                </Text>
              </T.Data>
            </T.Row>
          ))}
          <T.Row key={'total-row'}>
            <T.Data>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.total)}
              </Text>
            </T.Data>
            <T.Data></T.Data>
            <T.Data></T.Data>
            <T.Data>
              <Text variant="medium" fontWeight="semiBold">
                {totalBills.totalCharge
                  ? amountFormat(totalBills.totalCharge)
                  : ''}
              </Text>{' '}
            </T.Data>
            <T.Data>
              <Text variant="medium" fontWeight="semiBold">
                {totalBills.totalCovered
                  ? amountFormat(totalBills.totalCovered)
                  : ''}
              </Text>{' '}
            </T.Data>
          </T.Row>
        </T.Body>
      </T.Table>
      <DownloadFileButtons
        BoxProps={{
          paddingTop: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flexEnd',
        }}
        buttons={[
          {
            text: formatMessage(m.getAsExcel),
            onClick: () =>
              exportDentistFile(bills ?? [], 'xlsx', {
                charge: totalBills.totalCharge,
                covered: totalBills.totalCovered,
              }),
          },
        ]}
      />
    </Box>
  )
}

export default BillsTable
