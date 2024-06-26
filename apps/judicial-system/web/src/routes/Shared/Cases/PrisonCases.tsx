import React, { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  core,
  errors,
  tables,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  TagAppealState,
  TagCaseState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import {
  CaseListEntry,
  CaseState,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { usePrisonCasesQuery } from './prisonCases.generated'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const PrisonCases: FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const isPrisonUser = user?.institution?.type === InstitutionType.PRISON

  const { data, error, loading } = usePrisonCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  const [activeCases, pastCases] = useMemo(() => {
    if (!resCases) {
      return [[], []]
    }

    return partition(resCases, (c) => !c.isValidToDateInThePast)
  }, [resCases])

  const renderTable = useMemo(
    () => (cases: CaseListEntry[]) => {
      return (
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
              title: capitalize(formatMessage(tables.created)),
              sortable: { isSortable: true, key: 'created' },
            },
            { title: formatMessage(tables.state) },
            {
              title: formatMessage(tables.duration),
            },
          ]}
          data={cases}
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
              cell: (row) => <ColumnCaseType type={row.type} />,
            },
            {
              cell: (row) => <CreatedDate created={row.created} />,
            },
            {
              cell: (row) => (
                <>
                  <Box
                    display="inlineBlock"
                    marginRight={row.appealState ? 1 : 0}
                    marginBottom={row.appealState ? 1 : 0}
                  >
                    <TagCaseState caseState={CaseState.ACCEPTED} />
                  </Box>
                  {row.appealState && (
                    <TagAppealState
                      appealState={row.appealState}
                      appealRulingDecision={row.appealRulingDecision}
                    />
                  )}
                </>
              ),
            },
            {
              cell: (row) => (
                <Text>
                  {getDurationDate(
                    row.state,
                    row.validToDate,
                    row.initialRulingDate,
                    row.rulingDate,
                  )}
                </Text>
              ),
            },
          ]}
          generateContextMenuItems={(row) => [openCaseInNewTabMenuItem(row.id)]}
        />
      )
    },
    [formatMessage, openCaseInNewTabMenuItem],
  )

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      {error ? (
        <div
          className={styles.infoContainer}
          data-testid="custody-requests-error"
        >
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      ) : (
        <>
          <SectionHeading
            title={formatMessage(
              isPrisonUser
                ? m.activeRequests.prisonStaffUsers.title
                : m.activeRequests.prisonStaffUsers.prisonAdminTitle,
            )}
          />
          <Box marginBottom={[5, 5, 12]}>
            {loading || !user || activeCases.length > 0 ? (
              renderTable(activeCases)
            ) : (
              <div className={styles.infoContainer}>
                <AlertMessage
                  type="info"
                  title={formatMessage(
                    m.activeRequests.prisonStaffUsers.infoContainerTitle,
                  )}
                  message={formatMessage(
                    m.activeRequests.prisonStaffUsers.infoContainerText,
                  )}
                />
              </div>
            )}
          </Box>
        </>
      )}

      <SectionHeading
        title={formatMessage(
          isPrisonUser
            ? m.pastRequests.prisonStaffUsers.title
            : m.pastRequests.prisonStaffUsers.prisonAdminTitle,
        )}
      />
      {loading || pastCases.length > 0 ? (
        renderTable(pastCases)
      ) : (
        <div className={styles.infoContainer}>
          <AlertMessage
            type="info"
            title={formatMessage(
              m.activeRequests.prisonStaffUsers.infoContainerTitle,
            )}
            message={formatMessage(
              m.activeRequests.prisonStaffUsers.infoContainerText,
            )}
          />
        </div>
      )}
    </SharedPageLayout>
  )
}

export default PrisonCases
