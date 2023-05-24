import { useContext } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import router from 'next/router'

import { TempCase } from '@island.is/judicial-system-web/src/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import { Button, Text } from '@island.is/island-ui/core'
import {
  APPEAL_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
  STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseAppealRulingDecision,
  isCourtRole,
  isProsecutionRole,
} from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  UserRole,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'

import { strings } from './strings'

const renderLinkButton = (text: string, href: string) => {
  return (
    <Button
      variant="text"
      size="small"
      onClick={() => {
        router.push(href)
      }}
    >
      {text}
    </Button>
  )
}

const getAppealDecision = (
  formatMessage: IntlShape['formatMessage'],
  appealRulingDecision?: CaseAppealRulingDecision,
) => {
  if (appealRulingDecision === CaseAppealRulingDecision.ACCEPTING) {
    return formatMessage(appealRuling.decisionAccept)
  }
  if (appealRulingDecision === CaseAppealRulingDecision.REPEAL) {
    return formatMessage(appealRuling.decisionRepeal)
  }
  if (appealRulingDecision === CaseAppealRulingDecision.CHANGED) {
    return formatMessage(appealRuling.decisionChanged)
  }
  if (
    appealRulingDecision ===
    CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL
  ) {
    return formatMessage(appealRuling.decisionDismissedFromCourtOfAppeal)
  }
  if (appealRulingDecision === CaseAppealRulingDecision.DISMISSED_FROM_COURT) {
    return formatMessage(appealRuling.decisionDismissedFromCourt)
  }
  if (appealRulingDecision === CaseAppealRulingDecision.REMAND) {
    return formatMessage(appealRuling.decisionRemand)
  }
  return undefined
}

const useAppealAlertBanner = (
  workingCase: TempCase,
  onAppealAfterDeadline?: () => void,
  onStatementAfterDeadline?: () => void,
  onReceiveAppeal?: () => void,
) => {
  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)
  const isCourtRoleUser = isCourtRole(user?.role)
  const isProsecutionRoleUser = isProsecutionRole(user?.role)
  const isDefenderRoleUser = limitedAccess
  let title = ''
  let description: string | undefined = undefined
  let child: React.ReactElement | null = null

  const {
    prosecutorStatementDate,
    defendantStatementDate,
    statementDeadline,
    hasBeenAppealed,
    appealedByRole,
    appealedDate,
    canBeAppealed,
    appealDeadline,
    appealState,
    isAppealDeadlineExpired,
    appealReceivedByCourtDate,
    isStatementDeadlineExpired,
    appealRulingDecision,
  } = workingCase

  const hasCurrentUserSentStatement =
    (isProsecutionRoleUser && prosecutorStatementDate) ||
    (isDefenderRoleUser && defendantStatementDate)

  // HIGH COURT BANNER INFO IS HANDLED HERE
  if (user?.institution?.type === InstitutionType.HIGH_COURT) {
    if (appealState === CaseAppealState.COMPLETED) {
      title = formatMessage(strings.appealCompletedTitle, {
        appealedDate: formatDate(appealReceivedByCourtDate, 'PPP'),
      })
      description = getAppealDecision(formatMessage, appealRulingDecision)
    } else {
      title = formatMessage(strings.statementTitle)
      description = formatMessage(strings.statementDeadlineDescription, {
        isStatementDeadlineExpired: isStatementDeadlineExpired || false,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
      })
    }
  }
  // DEFENDER, PROSECUTOR AND COURT BANNER INFO IS HANDLED HERE:
  // When appeal has been received
  else if (appealState === CaseAppealState.RECEIVED) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired: isStatementDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
    // if the current user has already sent a statement, we don't want to display
    // the link to send a statement, instead we want to display the date it was sent
    if (hasCurrentUserSentStatement) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {formatMessage(strings.statementSentDescription, {
            statementSentDate: isProsecutionRoleUser
              ? formatDate(prosecutorStatementDate, 'PPPp')
              : formatDate(defendantStatementDate, 'PPPp'),
          })}
        </Text>
      )
    } else if (isCourtRoleUser) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {formatMessage(strings.appealReceivedNotificationSent, {
            appealReceivedDate: formatDate(appealReceivedByCourtDate, 'PPPp'),
          })}
        </Text>
      )
    } else {
      child = isStatementDeadlineExpired ? (
        <Button variant="text" size="small" onClick={onStatementAfterDeadline}>
          {formatMessage(strings.statementLinkText)}
        </Button>
      ) : (
        renderLinkButton(
          formatMessage(strings.statementLinkText),
          isDefenderRoleUser
            ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
            : `${STATEMENT_ROUTE}/${workingCase.id}`,
        )
      )
    }
  } else if (appealState === CaseAppealState.COMPLETED) {
    title = formatMessage(strings.appealCompletedTitle, {
      appealedDate: formatDate(appealReceivedByCourtDate, 'PPP'),
    })
    description = getAppealDecision(formatMessage, appealRulingDecision)
  }
  // When case has been appealed by prosecuor or defender
  else if (hasBeenAppealed) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDescription, {
      actor:
        appealedByRole === UserRole.PROSECUTOR
          ? formatMessage(core.prosecutor)
          : formatMessage(core.defender),
      appealDate: formatDate(appealedDate, 'PPPp'),
    })
    if (isProsecutionRoleUser || isDefenderRoleUser) {
      child = hasCurrentUserSentStatement
        ? (child = (
            <Text variant="small" color="mint800" fontWeight="semiBold">
              {formatMessage(strings.statementSentDescription, {
                statementSentDate: isProsecutionRoleUser
                  ? formatDate(prosecutorStatementDate, 'PPPp')
                  : formatDate(defendantStatementDate, 'PPPp'),
              })}
            </Text>
          ))
        : renderLinkButton(
            formatMessage(strings.statementLinkText),
            `${
              isDefenderRoleUser ? DEFENDER_STATEMENT_ROUTE : STATEMENT_ROUTE
            }/${workingCase.id}`,
          )
    } else if (isCourtRoleUser) {
      child = (
        <Button variant="text" size="small" onClick={onReceiveAppeal}>
          {formatMessage(strings.appealReceivedNotificationLinkText)}
        </Button>
      )
    }
  }
  // When case can be appealed
  else if (canBeAppealed) {
    title = formatMessage(strings.appealDeadlineTitle, {
      appealDeadline: formatDate(appealDeadline, 'PPPp'),
      isAppealDeadlineExpired: isAppealDeadlineExpired,
    })
    child = isAppealDeadlineExpired ? (
      <Button variant="text" size="small" onClick={onAppealAfterDeadline}>
        {formatMessage(strings.appealLinkText)}
      </Button>
    ) : (
      renderLinkButton(
        formatMessage(strings.appealLinkText),
        `${isDefenderRoleUser ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE}/${
          workingCase.id
        }`,
      )
    )
  }

  return {
    title,
    description,
    child,
  }
}

export default useAppealAlertBanner
