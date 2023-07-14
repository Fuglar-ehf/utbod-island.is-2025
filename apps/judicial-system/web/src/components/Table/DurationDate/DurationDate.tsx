import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'
import { tables } from '@island.is/judicial-system-web/messages'
import { Text } from '@island.is/island-ui/core'
import { CaseState } from '@island.is/judicial-system/types'

import { formatDate } from '@island.is/judicial-system/formatters'

export function getDurationDate(
  state: CaseState,
  validToDate?: string,
  initialRulingDate?: string,
  rulingDate?: string,
): string | null {
  if (
    [CaseState.REJECTED, CaseState.DISMISSED].includes(state) ||
    !validToDate
  ) {
    return null
  } else if (initialRulingDate) {
    return `${formatDate(parseISO(initialRulingDate), 'd.M.y')} - ${formatDate(
      parseISO(validToDate),
      'd.M.y',
    )}`
  } else if (rulingDate) {
    return `${formatDate(parseISO(rulingDate), 'd.M.y')} - ${formatDate(
      parseISO(validToDate),
      'd.M.y',
    )}`
  } else if (validToDate) {
    return formatDate(parseISO(validToDate), 'd.M.y') || null
  }
  return null
}

const DurationDate = ({ date }: { date: string | null }) => {
  const { formatMessage } = useIntl()
  if (!date) {
    return null
  }

  return (
    <Text fontWeight={'medium'} variant="small">
      {`${formatMessage(tables.duration)} ${date}`}
    </Text>
  )
}
export default DurationDate
