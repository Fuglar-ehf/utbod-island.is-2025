import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
  TabNavigation,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'

type Props = {
  children: React.ReactNode
  error: boolean
  loading: boolean
  pathname?: string
}

export const TherapiesWrapper = ({
  children,
  error,
  loading,
  pathname,
}: Props) => {
  const { formatMessage } = useLocale()

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.therapies).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.therapyTitle)}
        intro={formatMessage(messages.therapyDescription)}
        serviceProviderID={SJUKRATRYGGINGAR_ID}
        serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      />
      <TabNavigation
        label={formatMessage(messages.therapyTitle)}
        pathname={pathname}
        items={
          healthNavigation.children?.find((itm) => itm.name === m.therapies)
            ?.children ?? []
        }
      />
      <Box paddingY={4}>
        {!loading && !error && !children && (
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        )}

        {!loading && !error && children && (
          <Box marginTop={[6]}>{children}</Box>
        )}
      </Box>
    </Box>
  )
}
