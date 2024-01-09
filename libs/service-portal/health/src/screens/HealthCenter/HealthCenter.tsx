import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
  IntroHeader,
  CardLoader,
  SJUKRATRYGGINGAR_SLUG,
} from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import { useGetHealthCenterQuery } from './HealthCenter.generated'
import {
  AlertMessage,
  Box,
  Divider,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import HistoryTable from './HistoryTable'
import subYears from 'date-fns/subYears'
import { HealthPaths } from '../../lib/paths'
import { messages as hm } from '../../lib/messages'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

const HealthCenter = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const location = useLocation()

  // Check if the user was transfered from another health center
  const wasSuccessfulTransfer = location?.state?.transferSuccess

  const { loading, error, data } = useGetHealthCenterQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const healthCenterData = data?.rightsPortalHealthCenterRegistrationHistory

  const canRegister = healthCenterData?.canRegister ?? false

  if (loading)
    return (
      <Box>
        <Stack space={4}>
          <SkeletonLoader repeat={4} space={2} />
          <CardLoader />
        </Stack>
      </Box>
    )

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.healthCenter).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.healthCenterTitle)}
        intro={formatMessage(messages.healthCenterDescription)}
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
        serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      />

      {wasSuccessfulTransfer && !loading && (
        <Box width="full" marginTop={4}>
          <AlertMessage
            type="success"
            title={formatMessage(
              messages.healthCenterRegistrationTransferSuccessTitle,
            )}
            message={`${formatMessage(
              messages.healthCenterRegistrationTransferSuccessInfo,
            )} ${healthCenterData?.current?.healthCenterName}`}
          />
        </Box>
      )}

      {!loading && !healthCenterData?.current && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {healthCenterData?.current && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.myRegistration)}
              label={formatMessage(messages.healthCenterTitle)}
              content={
                healthCenterData.current.healthCenterName ??
                formatMessage(messages.healthCenterNoHealthCenterRegistered)
              }
              editLink={
                canRegister
                  ? {
                      url: HealthPaths.HealthCenterRegistration,
                      title: hm.changeRegistration,
                    }
                  : undefined
              }
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.personalDoctor)}
              content={
                healthCenterData.current.doctor ??
                formatMessage(messages.healthCenterNoDoctor)
              }
            />
            <Divider />
          </Stack>
        </Box>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && healthCenterData?.history?.length ? (
        <HistoryTable history={healthCenterData.history} />
      ) : null}
    </Box>
  )
}

export default HealthCenter
