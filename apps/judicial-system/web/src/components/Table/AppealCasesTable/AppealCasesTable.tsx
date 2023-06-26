import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import {
  Defendant,
  isRestrictionCase,
  CaseDecision as TCaseDecision,
} from '@island.is/judicial-system/types'
import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { core } from '@island.is/judicial-system-web/messages/Core'
import {
  useSortAppealCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import { TagAppealState } from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  SortButton,
  TableContainer,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'

import * as styles from '../Table.css'
import MobileAppealCase from './MobileAppealCase'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
  loading: boolean
  showingCompletedCases?: boolean
}

const AppealCasesTable: React.FC<Props> = (props) => {
  const { cases, onRowClick, loading, showingCompletedCases } = props
  const { formatMessage } = useIntl()
  const { sortedData, requestSort, getClassNamesFor } = useSortAppealCases(
    'appealedDate',
    'descending',
    cases,
  )
  const activeCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        (a['appealedDate'] ?? '').localeCompare(b['appealedDate'] ?? ''),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {activeCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileAppealCase
            theCase={theCase}
            onClick={() => onRowClick(theCase.id)}
          >
            {showingCompletedCases && (
              <Text fontWeight={'medium'} variant="small">
                {isRestrictionCase(theCase.type)
                  ? `${formatDate(theCase.courtEndTime ?? '', 'd.M.y')} -
                      ${formatDate(theCase.validToDate ?? '', 'd.M.y')}`
                  : ''}
              </Text>
            )}
          </MobileAppealCase>
        </Box>
      ))}
    </>
  ) : (
    <TableContainer
      loading={loading}
      tableHeader={
        <>
          <TableHeaderText title={formatMessage(tables.caseNumber)} />
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
              onClick={() => requestSort('defendant')}
              sortAsc={getClassNamesFor('defendant') === 'ascending'}
              sortDes={getClassNamesFor('defendant') === 'descending'}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.type)} />
          <TableHeaderText title={formatMessage(tables.state)} />
          {showingCompletedCases ? (
            <TableHeaderText title={formatMessage(tables.duration)} />
          ) : (
            <th className={cn(styles.th, styles.largeColumn)}>
              <SortButton
                title={formatMessage(tables.appealDate)}
                onClick={() => requestSort('appealedDate')}
                sortAsc={getClassNamesFor('appealedDate') === 'ascending'}
                sortDes={getClassNamesFor('appealedDate') === 'descending'}
              />
            </th>
          )}
        </>
      }
    >
      {sortedData.map((column) => {
        return (
          <tr
            className={styles.row}
            onClick={() => onRowClick(column.id)}
            key={column.id}
          >
            <td>
              <CourtCaseNumber
                courtCaseNumber={column.courtCaseNumber ?? ''}
                policeCaseNumbers={column.policeCaseNumbers ?? []}
                appealCaseNumber={column.appealCaseNumber ?? ''}
              />
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              <DefendantInfo defendants={column.defendants as Defendant[]} />
            </td>
            <td>
              <ColumnCaseType
                type={column.type}
                decision={column.decision as TCaseDecision}
                parentCaseId={column.parentCaseId ?? ''}
              />
            </td>
            <td>
              <TagAppealState
                appealState={column.appealState}
                appealRulingDecision={column.appealRulingDecision}
              />
            </td>
            <td>
              {showingCompletedCases ? (
                <Text>
                  {isRestrictionCase(column.type)
                    ? `${formatDate(column.courtEndTime ?? '', 'd.M.y')} -
                      ${formatDate(column.validToDate ?? '', 'd.M.y')}`
                    : ''}
                </Text>
              ) : (
                <Text>
                  {column.appealedDate
                    ? formatDate(column.appealedDate, 'd.M.y')
                    : '-'}
                </Text>
              )}
            </td>
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default AppealCasesTable
