import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  TagAppealState,
  TagCaseState,
  useWithdrawAppealMenuOption,
  WithdrawAppealContextMenuModal,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CourtDate,
  CreatedDate,
  DefendantInfo,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'

interface Props {
  cases: CaseListEntry[]
  showingCompletedCases?: boolean
}

export const DefenderCasesTable: FC<Props> = ({
  cases,
  showingCompletedCases,
}) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const {
    withdrawAppealMenuOption,
    caseToWithdraw,
    setCaseToWithdraw,
    shouldDisplayWithdrawAppealOption,
  } = useWithdrawAppealMenuOption()

  return (
    <Box>
      <Table
        thead={[
          {
            title: formatMessage(tables.caseNumber),
          },
          {
            title: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
            sortable: { isSortable: true, key: 'defendants' },
          },
          {
            title: formatMessage(tables.type),
          },
          {
            title: formatMessage(tables.created),
            sortable: { isSortable: true, key: 'created' },
          },
          { title: formatMessage(tables.state) },
          {
            title: formatMessage(
              showingCompletedCases
                ? tables.duration
                : tables.hearingArrangementDate,
            ),
            sortable: showingCompletedCases
              ? undefined
              : { isSortable: true, key: 'courtDate' },
          },
        ]}
        data={cases}
        generateContextMenuItems={(row) => [
          openCaseInNewTabMenuItem(row.id),
          ...(shouldDisplayWithdrawAppealOption(row)
            ? [withdrawAppealMenuOption(row.id)]
            : []),
        ]}
        columns={[
          {
            cell: (row) => (
              <CourtCaseNumber
                courtCaseNumber={row.courtCaseNumber ?? ''}
                policeCaseNumbers={row.policeCaseNumbers ?? []}
                appealCaseNumber={row.appealCaseNumber ?? ''}
              />
            ),
          },
          {
            cell: (row) => <DefendantInfo defendants={row.defendants} />,
          },
          {
            cell: (row) => (
              <ColumnCaseType
                type={row.type}
                decision={row.decision}
                parentCaseId={row.parentCaseId}
              />
            ),
          },
          { cell: (row) => <CreatedDate created={row.created} /> },
          {
            cell: (row) => (
              <>
                <Box display="flex" columnGap={1} rowGap={1} flexWrap="wrap">
                  <TagCaseState
                    caseState={row.state}
                    caseType={row.type}
                    isValidToDateInThePast={row.isValidToDateInThePast}
                    courtDate={row.courtDate}
                    indictmentDecision={row.indictmentDecision}
                    indictmentRulingDecision={row.indictmentRulingDecision}
                    defendants={row.defendants}
                  />
                  {row.appealState && (
                    <TagAppealState
                      appealState={row.appealState}
                      appealRulingDecision={row.appealRulingDecision}
                    />
                  )}
                </Box>
              </>
            ),
          },
          {
            cell: (row) =>
              showingCompletedCases ? (
                <Text>
                  {getDurationDate(
                    row.state,
                    row.validToDate,
                    row.initialRulingDate,
                    row.rulingDate,
                  )}
                </Text>
              ) : (
                <CourtDate
                  courtDate={row.courtDate}
                  postponedIndefinitelyExplanation={
                    row.postponedIndefinitelyExplanation
                  }
                  courtSessionType={row.courtSessionType}
                />
              ),
          },
        ]}
      />
      {caseToWithdraw && (
        <WithdrawAppealContextMenuModal
          caseId={caseToWithdraw}
          cases={cases}
          onClose={() => setCaseToWithdraw(undefined)}
        />
      )}
    </Box>
  )
}

export default DefenderCasesTable
