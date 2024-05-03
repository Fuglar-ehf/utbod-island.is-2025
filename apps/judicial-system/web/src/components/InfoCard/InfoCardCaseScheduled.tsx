import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

import { Institution } from '../../graphql/schema'
import InfoCard from './InfoCard'
import { strings } from './InfoCardCaseScheduled.strings'

interface Props {
  court: Institution
  courtDate: string
  courtRoom?: string | null
}

const InfoCardCaseScheduled: React.FC<Props> = (props) => {
  const { court, courtDate, courtRoom } = props
  const { formatMessage } = useIntl()

  return (
    <InfoCard
      data={[
        {
          title: formatMessage(strings.scheduled),
          value: (
            <>
              <Text variant="eyebrow" marginBottom={1} marginTop={2}>
                {formatDate(courtDate, 'PPPp')}
              </Text>
              {<Text>{court.name}</Text>}
              <Text>
                {formatMessage(strings.courtRoom, {
                  courtRoom: courtRoom ?? 'NONE',
                })}
              </Text>
            </>
          ),
        },
      ]}
      icon="calendar"
    />
  )
}

export default InfoCardCaseScheduled
