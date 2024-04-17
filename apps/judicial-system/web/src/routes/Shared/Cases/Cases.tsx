import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'

import { AlertMessage, Box, Select, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  core,
  errors,
  tables,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  ContextMenu,
  Logo,
  Modal,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  TagCaseState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { contextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu.strings'
import {
  ColumnCaseType,
  DefendantInfo,
  PastCasesTable,
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import {
  CaseListEntry,
  CaseState,
  CaseTransition,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import CasesAwaitingAssignmentTable from '../../Court/components/CasesAwaitingAssignmentTable/CasesAwaitingAssignmentTable'
import ActiveCases from './ActiveCases'
import { useCasesQuery } from './cases.generated'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

interface CreateCaseButtonProps {
  user: User
}

const CreateCaseButton: React.FC<CreateCaseButtonProps> = (props) => {
  const { user } = props
  const { formatMessage } = useIntl()

  const items = useMemo(() => {
    if (user.role === UserRole.PROSECUTOR_REPRESENTATIVE) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
      ]
    } else if (user.role === UserRole.PROSECUTOR) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
        {
          href: constants.CREATE_RESTRICTION_CASE_ROUTE,
          title: capitalize(formatMessage(core.restrictionCase)),
        },
        {
          href: constants.CREATE_TRAVEL_BAN_ROUTE,
          title: capitalize(formatMessage(core.travelBan)),
        },
        {
          href: constants.CREATE_INVESTIGATION_CASE_ROUTE,
          title: capitalize(formatMessage(core.investigationCase)),
        },
      ]
    } else {
      return []
    }
  }, [formatMessage, user?.role])

  return (
    <Box marginTop={[2, 2, 0]}>
      <ContextMenu
        dataTestId="createCaseDropdown"
        menuLabel="Tegund kröfu"
        items={items}
        title={formatMessage(m.createCaseButton)}
        offset={[0, 8]}
      />
    </Box>
  )
}

export const Cases: React.FC = () => {
  const { formatMessage } = useIntl()

  const [isFiltering, setIsFiltering] = useState<boolean>(false)
  const [modalVisible, setVisibleModal] = useState<string>()

  const { user } = useContext(UserContext)
  const { openCaseInNewTabMenuItem } = useContextMenu()
  const { transitionCase, isTransitioningCase, isSendingNotification } =
    useCase()

  const { data, error, loading, refetch } = useCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsFiltering(false)
    }, 250)

    return () => {
      clearTimeout(loadingTimeout)
    }
  }, [isFiltering])

  const [
    casesAwaitingConfirmation,
    allActiveCases,
    allPastCases,
    casesAwaitingAssignment,
  ] = useMemo(() => {
    if (!resCases) {
      return [[], [], [], []]
    }

    const filterCases = (predicate: (c: CaseListEntry) => boolean) =>
      resCases.filter(predicate)

    const casesAwaitingConfirmation = filterCases(
      (c) => c.state === CaseState.WAITING_FOR_CONFIRMATION,
    )

    const casesAwaitingAssignment = filterCases(
      (c) => isIndictmentCase(c.type) && c.judge === null,
    )

    const activeCases = filterCases((c) => {
      if (
        c.state === CaseState.DELETED ||
        c.state === CaseState.WAITING_FOR_CONFIRMATION ||
        (isDistrictCourtUser(user) && casesAwaitingAssignment.includes(c))
      ) {
        return false
      }

      if (isIndictmentCase(c.type) || !isDistrictCourtUser(user)) {
        return !isCompletedCase(c.state)
      } else {
        return !(isCompletedCase(c.state) && c.rulingSignatureDate)
      }
    })

    const pastCases = filterCases(
      (c) => !activeCases.includes(c) && !casesAwaitingAssignment.includes(c),
    )

    return [
      casesAwaitingConfirmation as CaseListEntry[],
      activeCases as CaseListEntry[],
      pastCases as CaseListEntry[],
      casesAwaitingAssignment as CaseListEntry[],
    ]
  }, [resCases, user])

  const {
    filter,
    setFilter,
    options: filterOptions,
    activeCases,
    pastCases,
  } = useFilter(allActiveCases, allPastCases, user)

  const deleteCase = async (caseToDelete: CaseListEntry) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED ||
      caseToDelete.state === CaseState.WAITING_FOR_CONFIRMATION
    ) {
      await transitionCase(caseToDelete.id, CaseTransition.DELETE)
      refetch()
    }
  }

  const handlePrimaryButtonClick = async () => {
    const caseToDelete = [...allActiveCases, ...casesAwaitingConfirmation].find(
      (c) => c.id === modalVisible,
    )

    if (!caseToDelete) {
      return
    }

    await deleteCase(caseToDelete)
    setVisibleModal(undefined)
  }

  const handleSecondaryButtonClick = () => {
    setVisibleModal(undefined)
  }

  return (
    <>
      <SharedPageLayout>
        <PageHeader title={formatMessage(titles.shared.cases)} />
        <div className={styles.logoContainer}>
          <Logo />
          {user && isProsecutionUser(user) ? (
            <CreateCaseButton user={user} />
          ) : null}
        </div>
        <Box marginBottom={[2, 2, 5]} className={styles.filterContainer}>
          <Select
            name="filter-cases"
            options={filterOptions}
            label={formatMessage(m.filter.label)}
            onChange={(value) => {
              setIsFiltering(true)
              setFilter(value as FilterOption)
            }}
            value={filter}
          />
        </Box>
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
            {isProsecutionUser(user) && (
              <>
                <SectionHeading
                  title={formatMessage(
                    m.activeRequests.casesAwaitingConfirmationTitle,
                  )}
                />
                <AnimatePresence initial={false}>
                  <Box marginBottom={[5, 5, 12]}>
                    {loading || isFiltering ? (
                      <TableSkeleton />
                    ) : casesAwaitingConfirmation.length > 0 ? (
                      <Table
                        thead={[
                          {
                            title: formatMessage(tables.caseNumber),
                          },
                          {
                            title: capitalize(
                              formatMessage(core.defendant, { suffix: 'i' }),
                            ),
                            sortable: { isSortable: true, key: 'defendant' },
                          },
                          {
                            title: formatMessage(
                              m.activeRequests.table.headers.type,
                            ),
                          },
                          {
                            title: capitalize(
                              formatMessage(tables.created, { suffix: 'i' }),
                            ),
                            sortable: { isSortable: true, key: 'createdAt' },
                          },
                          { title: formatMessage(tables.state) },
                          {
                            title: formatMessage(
                              m.activeRequests.table.headers.prosecutor,
                            ),
                          },
                        ]}
                        data={casesAwaitingConfirmation}
                        generateContextMenuItems={(row: CaseListEntry) => {
                          return [
                            openCaseInNewTabMenuItem(row.id),
                            {
                              title: formatMessage(contextMenu.deleteCase),
                              onClick: () => {
                                setVisibleModal(row.id)
                              },
                              icon: 'trash',
                            },
                          ]
                        }}
                        columns={[
                          {
                            cell: (row: CaseListEntry) => (
                              <Text
                                as="span"
                                title={row.policeCaseNumbers?.join(', ')}
                              >
                                {displayFirstPlusRemaining(
                                  row.policeCaseNumbers,
                                ) || '-'}
                              </Text>
                            ),
                          },
                          {
                            cell: (row: CaseListEntry) => (
                              <DefendantInfo defendants={row.defendants} />
                            ),
                          },
                          {
                            cell: (row: CaseListEntry) => (
                              <ColumnCaseType type={row.type} />
                            ),
                          },
                          {
                            cell: (row: CaseListEntry) => (
                              <Text as="span">
                                {formatDate(row.created, 'd.M.y')}
                              </Text>
                            ),
                          },
                          {
                            cell: () => (
                              <TagCaseState
                                caseState={CaseState.WAITING_FOR_CONFIRMATION}
                              />
                            ),
                          },
                          {
                            cell: (row: CaseListEntry) => (
                              <Text as="span">{row.prosecutor?.name}</Text>
                            ),
                          },
                        ]}
                      />
                    ) : (
                      <motion.div
                        className={styles.infoContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertMessage
                          type="info"
                          title={formatMessage(
                            m.activeRequests
                              .casesAwaitingConfirmationInfoContainerTitle,
                          )}
                          message={formatMessage(
                            m.activeRequests
                              .casesAwaitingConfirmationInfoContainerText,
                          )}
                        />
                      </motion.div>
                    )}
                  </Box>
                </AnimatePresence>
              </>
            )}

            {isDistrictCourtUser(user) && filter.value !== 'INVESTIGATION' && (
              <CasesAwaitingAssignmentTable
                cases={casesAwaitingAssignment}
                loading={loading || isFiltering}
                isFiltering={isFiltering}
              />
            )}
            <SectionHeading title={formatMessage(m.activeRequests.title)} />
            <Box marginBottom={[5, 5, 12]}>
              {loading || isFiltering ? (
                <TableSkeleton />
              ) : activeCases.length > 0 ? (
                <ActiveCases
                  cases={activeCases}
                  isDeletingCase={isTransitioningCase || isSendingNotification}
                  onDeleteCase={deleteCase}
                />
              ) : (
                <div className={styles.infoContainer}>
                  <AlertMessage
                    type="info"
                    title={formatMessage(m.activeRequests.infoContainerTitle)}
                    message={formatMessage(m.activeRequests.infoContainerText)}
                  />
                </div>
              )}
            </Box>
            <SectionHeading title={formatMessage(tables.completedCasesTitle)} />
            {loading || pastCases.length > 0 ? (
              <PastCasesTable
                cases={pastCases}
                loading={loading || isFiltering}
                testid="pastCasesTable"
              />
            ) : (
              <div className={styles.infoContainer}>
                <AlertMessage
                  type="info"
                  title={formatMessage(m.pastRequests.infoContainerTitle)}
                  message={formatMessage(m.pastRequests.infoContainerText)}
                />
              </div>
            )}
          </>
        )}
      </SharedPageLayout>
      {modalVisible !== undefined && (
        <Modal
          title={formatMessage(m.activeRequests.deleteCaseModal.title)}
          text={formatMessage(m.activeRequests.deleteCaseModal.text)}
          onPrimaryButtonClick={handlePrimaryButtonClick}
          onSecondaryButtonClick={handleSecondaryButtonClick}
          primaryButtonText={formatMessage(
            m.activeRequests.deleteCaseModal.primaryButtonText,
          )}
          primaryButtonColorScheme="destructive"
          secondaryButtonText={formatMessage(
            m.activeRequests.deleteCaseModal.secondaryButtonText,
          )}
          isPrimaryButtonLoading={isTransitioningCase || isSendingNotification}
        />
      )}
    </>
  )
}

export default Cases
