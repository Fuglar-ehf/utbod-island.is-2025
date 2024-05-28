import React from 'react'
import { IntlShape, useIntl } from 'react-intl'

import { Tag, TagVariant } from '@island.is/island-ui/core'
import {
  isIndictmentCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import {
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './TagCaseState.strings'

interface Props {
  caseState?: CaseState | null
  caseType?: CaseType | null
  isCourtRole?: boolean
  isValidToDateInThePast?: boolean | null
  courtDate?: string | null
  indictmentReviewer?: User | null
  customMapCaseStateToTag?: (
    formatMessage: IntlShape['formatMessage'],
    state?: CaseState | null,
    indictmentReviewer?: User | null, // TODO: Refactor so we have a more generalized interface for the info passed in to the component
  ) => { color: TagVariant; text: string }
}

export const mapIndictmentCaseStateToTagVariant = (
  formatMessage: IntlShape['formatMessage'],
  state?: CaseState | null,
  indictmentReviewer?: User | null,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.COMPLETED:
      return {
        color: indictmentReviewer ? 'mint' : 'purple',
        text: formatMessage(
          indictmentReviewer ? strings.beingReviewed : strings.new,
        ),
      }
    default:
      return { color: 'white', text: formatMessage(strings.unknown) }
  }
}

export const mapCaseStateToTagVariant = (
  formatMessage: IntlShape['formatMessage'],
  state?: CaseState | null,
  caseType?: CaseType | null,
  isValidToDateInThePast?: boolean | null,
  scheduledDate?: string | null,
  isCourtRole?: boolean,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
    case CaseState.WAITING_FOR_CONFIRMATION:
      return { color: 'red', text: formatMessage(strings.draft) }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: formatMessage(isCourtRole ? strings.new : strings.sent),
      }
    case CaseState.RECEIVED:
      return scheduledDate
        ? { color: 'mint', text: formatMessage(strings.scheduled) }
        : { color: 'blueberry', text: formatMessage(strings.received) }
    case CaseState.MAIN_HEARING:
      return { color: 'blue', text: formatMessage(strings.reassignment) }
    case CaseState.ACCEPTED:
    case CaseState.COMPLETED:
      return isIndictmentCase(caseType) || isValidToDateInThePast
        ? { color: 'darkerBlue', text: formatMessage(strings.inactive) }
        : {
            color: 'blue',
            text: formatMessage(
              isInvestigationCase(caseType) ? strings.accepted : strings.active,
            ),
          }
    case CaseState.REJECTED:
      return { color: 'rose', text: formatMessage(strings.rejected) }
    case CaseState.DISMISSED:
      return { color: 'dark', text: formatMessage(strings.dismissed) }
    default:
      return { color: 'white', text: formatMessage(strings.unknown) }
  }
}

const TagCaseState: React.FC<React.PropsWithChildren<Props>> = (Props) => {
  const { formatMessage } = useIntl()
  const {
    caseState,
    caseType,
    isCourtRole,
    isValidToDateInThePast,
    courtDate,
    indictmentReviewer,
    customMapCaseStateToTag,
  } = Props

  const tagVariant = customMapCaseStateToTag
    ? customMapCaseStateToTag(formatMessage, caseState, indictmentReviewer)
    : mapCaseStateToTagVariant(
        formatMessage,
        caseState,
        caseType,
        isValidToDateInThePast,
        courtDate,
        isCourtRole,
      )

  if (!tagVariant) return null

  return (
    <Tag variant={tagVariant?.color} outlined disabled truncate>
      {tagVariant.text}
    </Tag>
  )
}

export default TagCaseState
