import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import router from 'next/router'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import localeIS from 'date-fns/locale/is'

import { Box, Icon, Text } from '@island.is/island-ui/core'

import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { CaseType, isIndictmentCase } from '@island.is/judicial-system/types'

import { TempCaseListEntry as CaseListEntry } from '@island.is/judicial-system-web/src/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import TableSkeleton from '@island.is/judicial-system-web/src/routes/Shared/Cases/TableSkeleton'
import {
  DEFENDER_INDICTMENT_ROUTE,
  DEFENDER_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  TagAppealState,
  TagCaseState,
  DefendantInfo,
  CourtCaseNumber,
} from '@island.is/judicial-system-web/src/components'

import * as styles from './DefenderCasesTable.css'
import useSortCases from '../hooks/useSortCases'

interface Props {
  cases: CaseListEntry[]
  showingCompletedCases?: boolean
  loading?: boolean
}

export const DefenderCasesTable: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { cases, showingCompletedCases, loading } = props
  const { sortedData, requestSort, getClassNamesFor } = useSortCases(
    'createdAt',
    'descending',
    cases,
  )

  const handleRowClick = (id: string, type: CaseType) => {
    isIndictmentCase(type)
      ? router.push(`${DEFENDER_INDICTMENT_ROUTE}/${id}`)
      : router.push(`${DEFENDER_ROUTE}/${id}`)
  }

  return (
    <Box marginBottom={7}>
      {loading ? (
        <TableSkeleton />
      ) : (
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  {formatMessage(tables.caseNumber)}
                </Text>
              </th>
              <th className={styles.th}>
                <Box
                  component="button"
                  display="flex"
                  alignItems="center"
                  className={styles.thButton}
                  onClick={() => requestSort('createdAt')}
                >
                  <Text fontWeight="regular">
                    {formatMessage(tables.created)}
                  </Text>
                  <Box
                    className={cn(styles.sortIcon, {
                      [styles.sortCreatedAsc]:
                        getClassNamesFor('createdAt') === 'ascending',
                      [styles.sortCreatedDes]:
                        getClassNamesFor('createdAt') === 'descending',
                    })}
                    marginLeft={1}
                    component="span"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon icon="caretUp" size="small" />
                  </Box>
                </Box>
              </th>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  {formatMessage(tables.type)}
                </Text>
              </th>
              <th className={cn(styles.th, styles.largeColumn)}>
                <Box
                  component="button"
                  display="flex"
                  alignItems="center"
                  className={styles.thButton}
                  onClick={() => requestSort('defendant')}
                  data-testid="accusedNameSortButton"
                >
                  <Text fontWeight="regular">
                    {capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
                  </Text>
                  <Box
                    className={cn(styles.sortIcon, {
                      [styles.sortAccusedNameAsc]:
                        getClassNamesFor('defendant') === 'ascending',
                      [styles.sortAccusedNameDes]:
                        getClassNamesFor('defendant') === 'descending',
                    })}
                    marginLeft={1}
                    component="span"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon icon="caretDown" size="small" />
                  </Box>
                </Box>
              </th>
              <th className={cn(styles.th, styles.largeColumn)}>
                <Text as="span" fontWeight="regular">
                  {formatMessage(tables.state)}
                </Text>
              </th>
              {showingCompletedCases ? (
                <th>
                  <Text fontWeight="regular">
                    {formatMessage(tables.duration)}
                  </Text>
                </th>
              ) : (
                <th>
                  <Text fontWeight="regular">
                    {formatMessage(tables.hearingArrangementDate)}
                  </Text>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData?.map((c: CaseListEntry) => (
              <tr
                className={cn(styles.tableRowContainer)}
                key={c.id}
                onClick={() => handleRowClick(c.id, c.type)}
              >
                <td className={styles.td}>
                  <CourtCaseNumber
                    courtCaseNumber={c.courtCaseNumber}
                    policeCaseNumbers={c.policeCaseNumbers}
                  />
                </td>
                <td className={cn(styles.td)}>
                  <Text as="span">
                    {format(parseISO(c.created), 'd.M.y', {
                      locale: localeIS,
                    })}
                  </Text>
                </td>
                <td className={styles.td}>
                  <Text as="span">
                    {displayCaseType(formatMessage, c.type, c.decision)}
                  </Text>
                </td>
                <td className={cn(styles.td)}>
                  <DefendantInfo defendants={c.defendants} />
                </td>
                <td className={styles.td} data-testid="tdTag">
                  <Box marginRight={1} marginBottom={1}>
                    <TagCaseState
                      caseState={c.state}
                      caseType={c.type}
                      isValidToDateInThePast={c.isValidToDateInThePast}
                      courtDate={c.courtDate}
                    />
                  </Box>
                  {c.appealState && (
                    <TagAppealState
                      appealState={c.appealState}
                      appealRulingDecision={c.appealRulingDecision}
                    />
                  )}
                </td>
                {showingCompletedCases ? (
                  <td className={styles.td}>
                    <Text>
                      {c.validToDate &&
                        c.courtEndTime &&
                        `${formatDate(c.courtEndTime, 'd.M.y')} - ${formatDate(
                          c.validToDate,
                          'd.M.y',
                        )}`}
                    </Text>
                  </td>
                ) : (
                  <td className={styles.td}>
                    {c.courtDate && (
                      <>
                        <Text>
                          <Box component="span" className={styles.blockColumn}>
                            {capitalize(
                              format(parseISO(c.courtDate), 'EEEE d. LLLL y', {
                                locale: localeIS,
                              }),
                            ).replace('dagur', 'd.')}
                          </Box>
                        </Text>
                        <Text as="span" variant="small">
                          kl. {format(parseISO(c.courtDate), 'kk:mm')}
                        </Text>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  )
}

export default DefenderCasesTable
