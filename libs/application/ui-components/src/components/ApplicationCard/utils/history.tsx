import React from 'react'
import { ApplicationStatus } from '@island.is/application/types'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import format from 'date-fns/format'
import { ApplicationCardFields, ApplicationCardHistoryItem } from '../types'
import { coreMessages } from '@island.is/application/core'

export const buildHistoryItems = (
  application: ApplicationCardFields,
  formatMessage: FormatMessage,
  dateFormat: string,
  openApplication?: () => void,
): ApplicationCardHistoryItem[] | undefined => {
  if (application.status === ApplicationStatus.DRAFT) return

  let history: {
    title: string
    date?: string
    content?: React.ReactNode
  }[] = []

  if (application.actionCard?.pendingAction?.title) {
    history.push({
      date: format(new Date(), dateFormat),
      title: formatMessage(application.actionCard.pendingAction.title ?? ''),
      content: application.actionCard.pendingAction.content ? (
        <AlertMessage
          type={application.actionCard?.pendingAction?.displayStatus}
          message={formatMessage(
            application.actionCard.pendingAction.content ?? '',
          )}
          action={
            openApplication !== undefined ? (
              <Box>
                <Button
                  variant="text"
                  size="small"
                  nowrap
                  onClick={openApplication}
                  icon="pencil"
                >
                  {formatMessage(coreMessages.cardButtonDraft)}
                </Button>
              </Box>
            ) : undefined
          }
        />
      ) : undefined,
    })
  }

  if (application.actionCard?.history) {
    history = history.concat(
      application.actionCard?.history.map((x) => ({
        date: format(new Date(x.date), dateFormat),
        title: formatMessage(x.log),
      })),
    )
  }

  return history
}
