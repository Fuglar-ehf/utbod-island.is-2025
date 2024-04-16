import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import capitalize from 'lodash/capitalize'
import {
  m,
  amountFormat,
  formatDate,
  NestedTable,
  displayMonthOrYear,
} from '@island.is/service-portal/core'
import { ExpandRow, ExpandHeader } from '@island.is/service-portal/core'
import { m as messages } from '../../lib/messages'
import { HousingBenefitsPayments } from '@island.is/api/schema'
import { HousingBenefitsFooter } from './HousingBenefitsFooter'

export const ITEMS_ON_PAGE = 12

interface Props {
  payments: HousingBenefitsPayments
  page: number
  setPage: (n: number) => void
}

const HousingBenefitsTable = ({ payments, page, setPage }: Props) => {
  const { formatMessage, lang } = useLocale()

  const recordsArray = payments.data

  const totalPages =
    payments.totalCount > ITEMS_ON_PAGE
      ? Math.ceil(payments.totalCount / ITEMS_ON_PAGE)
      : 0

  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.dateShort) },
            { value: formatMessage(messages.hbRentMonth) },
            { value: formatMessage(messages.hbPaymentBeforeDebt) },
            { value: formatMessage(messages.hbDebtPaidOff) },
            { value: formatMessage(messages.hbPaidOut) },
            { value: formatMessage(messages.hbDebtStatus), align: 'right' },
          ]}
        />
        <T.Body>
          {recordsArray.map((record) => (
            <ExpandRow
              key={record.nr}
              data={[
                { value: formatDate(record.dateTransfer) },
                {
                  value: record.month
                    ? capitalize(displayMonthOrYear(record.month, lang))
                    : '',
                },
                { value: amountFormat(record.paymentBeforeDebt) },
                { value: amountFormat(record.paidOfDebt) },
                { value: amountFormat(record.paymentActual) },
                { value: amountFormat(record.remainDebt), align: 'right' },
              ]}
            >
              <NestedTable
                data={[
                  {
                    title: formatMessage(messages.hbNumberOfDays),
                    value: record.noDays ?? '',
                  },
                  {
                    title: formatMessage(messages.hbPaymentNumber),
                    value: record.nr ?? '',
                  },
                  {
                    title: formatMessage(messages.hbTotalIncome),
                    value: amountFormat(record.totalIncome),
                  },
                  {
                    title: formatMessage(messages.hbName),
                    value: record.name ?? '',
                  },
                  {
                    title: formatMessage(messages.hbBenefit),
                    value: record.benefit ?? '',
                  },
                  {
                    title: formatMessage(messages.hbBanknumber),
                    value: record.bankAccountMerged ?? '',
                  },
                  {
                    title: formatMessage(messages.hbReductionIncome),
                    value: amountFormat(record.reductionIncome),
                  },
                  {
                    title: formatMessage(messages.hbDateOfBankTransfer),
                    value: formatDate(record.dateTransfer),
                  },
                  {
                    title: formatMessage(messages.hbReductionHousingCost),
                    value: amountFormat(record.reductionHousingCost),
                  },
                  {
                    title: formatMessage(messages.hbTypeOfCalculation),
                    value: record.calculationType ?? '',
                  },
                  {
                    title: formatMessage(messages.hbReductionAssets),
                    value: amountFormat(record.reductionAssets),
                  },
                ]}
              />
            </ExpandRow>
          ))}
        </T.Body>
        <HousingBenefitsFooter paymentArray={payments.data ?? []} />
      </T.Table>
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(p, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(p)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </>
  )
}

export default HousingBenefitsTable
