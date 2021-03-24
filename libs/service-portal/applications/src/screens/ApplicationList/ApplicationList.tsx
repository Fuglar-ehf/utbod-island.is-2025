import React from 'react'
import format from 'date-fns/format'
import {
  ActionCardLoader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
  ActionCard,
} from '@island.is/island-ui/core'
import { useApplications } from '@island.is/service-portal/graphql'
import { Application, getSlugFromType } from '@island.is/application/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'

import { m } from '../../lib/messages'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')

  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage, lang } = useLocale()
  const { data: applications, loading, error } = useApplications()
  const dateFormat = lang === 'is' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage(m.heading)}
              </Text>

              <Text as="p" variant="intro">
                {formatMessage(m.introCopy)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>

      {loading && <ActionCardLoader repeat={3} />}

      {error && (
        <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
          <Text variant="h3" as="h3">
            {formatMessage(m.error)}
          </Text>
        </Box>
      )}

      <Stack space={2}>
        {applications.map((application: Application) => {
          const isComplete = application.progress === 1
          const slug = getSlugFromType(application.typeId)

          if (!slug) {
            return null
          }

          return (
            <ActionCard
              key={application.id}
              date={format(new Date(application.modified), dateFormat)}
              heading={application.name || application.typeId}
              tag={{
                label: isComplete
                  ? formatMessage(m.cardStatusDone)
                  : formatMessage(m.cardStatusInProgress),
                variant: isComplete ? 'mint' : 'blue',
                outlined: false,
              }}
              cta={{
                label: isComplete
                  ? formatMessage(m.cardButtonComplete)
                  : formatMessage(m.cardButtonInProgress),
                variant: 'ghost',
                size: 'small',
                icon: undefined,
                onClick: () =>
                  window.open(`${baseUrlForm}/${slug}/${application.id}`),
              }}
              text={
                isComplete
                  ? formatMessage(m.cardStatusCopyDone)
                  : formatMessage(m.cardStatusCopyDone)
              }
              progressMeter={{
                active: !isComplete,
                progress: application.progress ? application.progress : 0,
                variant: isComplete ? 'mint' : 'blue',
              }}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default ApplicationList
