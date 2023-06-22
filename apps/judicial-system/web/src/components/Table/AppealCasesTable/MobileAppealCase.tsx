import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'

import {
  displayFirstPlusRemaining,
  formatDOB,
} from '@island.is/judicial-system/formatters'

import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import { AppealedCasesQueryResponse } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/Cases/Cases'
import { TagAppealState } from '@island.is/judicial-system-web/src/components'
import { CategoryCard } from '@island.is/judicial-system-web/src/components/Table'

interface Props {
  theCase: AppealedCasesQueryResponse
  onClick: () => void
}

const MobileAppealCase: React.FC<Props> = ({ theCase, onClick, children }) => {
  const { formatMessage } = useIntl()

  return (
    <CategoryCard
      heading={displayCaseType(formatMessage, theCase.type, theCase.decision)}
      onClick={onClick}
      tags={[
        <TagAppealState
          appealState={theCase.appealState}
          appealRulingDecision={theCase.appealRulingDecision}
        />,
      ]}
    >
      {theCase.appealCaseNumber && <Text>{theCase.appealCaseNumber}</Text>}
      <Text title={theCase.policeCaseNumbers.join(', ')}>
        {displayFirstPlusRemaining(theCase.policeCaseNumbers)}
      </Text>
      {theCase.courtCaseNumber && <Text>{theCase.courtCaseNumber}</Text>}
      <br />
      {theCase.defendants && theCase.defendants.length > 0 && (
        <>
          <Text>{theCase.defendants[0].name ?? ''}</Text>
          {theCase.defendants.length === 1 ? (
            <Text>
              {formatDOB(
                theCase.defendants[0].nationalId,
                theCase.defendants[0].noNationalId,
              )}
            </Text>
          ) : (
            <Text>{`+ ${theCase.defendants.length - 1}`}</Text>
          )}
        </>
      )}
      <Box marginTop={1}>{children}</Box>
    </CategoryCard>
  )
}

export default MobileAppealCase
