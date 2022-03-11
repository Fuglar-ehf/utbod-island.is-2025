import React, { FC } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { ExpandRow } from '../../components/ExpandableTable'
import amountFormat from '../../utils/amountFormat'
import FinanceScheduleDetailTable from '../FinanceScheduleDetailTable/FinanceScheduleDetailTable'
import { DetailedSchedule, PaymentSchedule } from '@island.is/api/schema'
import { Box, Button } from '@island.is/island-ui/core'

const GET_FINANCE_PAYMENT_SCHEDULE_BY_ID = gql`
  query getPaymentScheduleByIdQuery($input: GetFinancePaymentScheduleInput!) {
    getPaymentScheduleById(input: $input) {
      myDetailedSchedules {
        myDetailedSchedule {
          paidDate
          paidAmount
          paidAmountAccumulated
          paymentNumber
          payments {
            payAmount
            payAmountAccumulated
            payDate
            payExplanation
          }
          plannedAmount
          plannedAmountAccumulated
          plannedDate
        }
      }
    }
  }
`

interface Props {
  paymentSchedule: PaymentSchedule
}

const FinanceScheduleTableRow: FC<Props> = ({ paymentSchedule }) => {
  const [
    getPaymentScheduleById,
    { loading, error, ...detailsQuery },
  ] = useLazyQuery(GET_FINANCE_PAYMENT_SCHEDULE_BY_ID)

  const paymentDetailData: Array<DetailedSchedule> =
    detailsQuery?.data?.getPaymentScheduleById.myDetailedSchedules
      .myDetailedSchedule || []

  const getType = (type: string) => {
    switch (type) {
      case 'S':
        return 'Í gildi'
      case 'E':
        return 'Ógild'
      case 'L':
        return 'Lokið'
      default:
        return 'Í gildi'
    }
  }

  return (
    <ExpandRow
      onExpandCallback={() =>
        getPaymentScheduleById({
          variables: {
            input: { scheduleNumber: paymentSchedule.scheduleNumber },
          },
        })
      }
      data={[
        { value: paymentSchedule.approvalDate },
        { value: paymentSchedule.scheduleName },
        { value: amountFormat(paymentSchedule.totalAmount) },
        { value: amountFormat(paymentSchedule.totalAmount) },
        { value: `0 af ${paymentSchedule.paymentCount}` },
        { value: getType(paymentSchedule.scheduleStatus) },
        {
          value: (
            /**TODO: Add PDF download link */
            <Box display="flex" flexDirection="row" alignItems="center">
              <Button
                size="small"
                variant="text"
                icon="document"
                iconType="outline"
              >
                PDF
              </Button>
            </Box>
          ),
          align: 'right',
        },
      ]}
      loading={loading}
    >
      {!loading && !error && (
        <FinanceScheduleDetailTable data={paymentDetailData} />
      )}
    </ExpandRow>
  )
}

export default FinanceScheduleTableRow
