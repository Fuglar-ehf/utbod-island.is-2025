import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  FootNote,
  IntroHeader,
  UserInfoLine,
  amountFormat,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { useGetPreviousPaymentsQuery } from './PaymentPlan.generated'
import { PaymentGroupTable } from '../../components'

const PaymentPlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPreviousPaymentsQuery()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(coreMessages.socialInsuranceMaintenance)}
        intro={formatMessage(
          coreMessages.socialInsuranceMaintenanceDescription,
        )}
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip={formatMessage(
          coreMessages.socialInsuranceTooltip,
        )}
      />
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !error && !loading && !data?.socialInsurancePayments ? (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessages.noData)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      ) : (
        <>
          <Box>
            <Stack space={1}>
              <UserInfoLine
                label={formatMessage(m.nextPayment)}
                content={
                  data?.socialInsurancePayments?.nextPayment
                    ? amountFormat(data?.socialInsurancePayments?.nextPayment)
                    : ' 0 kr.'
                }
                loading={loading}
              />
              <Divider />
              <UserInfoLine
                label={formatMessage(m.previousMonthsPayment)}
                content={
                  data?.socialInsurancePayments?.previousPayment
                    ? amountFormat(
                        data?.socialInsurancePayments?.previousPayment,
                      )
                    : ' 0 kr.'
                }
                loading={loading}
              />
              <Divider />
            </Stack>

            <Text marginTop={[2, 2, 6]} marginBottom={2} variant="h5">
              {formatMessage(coreMessages.period)}
            </Text>

            <PaymentGroupTable />
          </Box>
          <Box>
            <Text variant="small" marginTop={5} marginBottom={2}>
              {formatMessage(m.maintenanceFooter)}
            </Text>
          </Box>
        </>
      )}
      <FootNote serviceProviderSlug="tryggingastofnun" />
    </Box>
  )
}

export default PaymentPlan
