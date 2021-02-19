import React, { useEffect, useState, useContext, useMemo } from 'react'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import localeIS from 'date-fns/locale/is'
import localeDE from 'date-fns/locale/de'
import cn from 'classnames'
import {
  AlertMessage,
  Button,
  Text,
  Tag,
  TagVariant,
  Box,
  Icon,
} from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Loading,
  Logo,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
} from '@island.is/judicial-system/types'
import { UserRole } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  insertAt,
  parseTransition,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { useMutation, useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useHistory } from 'react-router-dom'
import {
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import * as styles from './DetentionRequests.treat'

type directionType = 'ascending' | 'descending'
interface SortConfig {
  key: keyof Case
  direction: directionType
}

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const DetentionRequests: React.FC = () => {
  const [cases, setCases] = useState<Case[]>()
  const [sortConfig, setSortConfig] = useState<SortConfig>()

  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  const { user } = useContext(UserContext)
  const history = useHistory()

  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isJudge = user?.role === UserRole.JUDGE
  const isRegistrar = user?.role === UserRole.REGISTRAR

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.REVOKED,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const resCases = data?.cases

  useMemo(() => {
    const sortedCases = cases || []

    if (sortConfig) {
      sortedCases.sort((a: Case, b: Case) => {
        // Credit: https://stackoverflow.com/a/51169
        return sortConfig.direction === 'ascending'
          ? ('' + a[sortConfig.key]).localeCompare(
              b[sortConfig.key]?.toString() || '',
            )
          : ('' + b[sortConfig.key]).localeCompare(
              a[sortConfig.key]?.toString() || '',
            )
      })
    }
    return sortedCases
  }, [cases, sortConfig])

  useEffect(() => {
    document.title = 'Allar kröfur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (resCases && !cases) {
      // Remove deleted cases
      const casesWithoutDeleted = resCases.filter((c: Case) => {
        return c.state !== CaseState.DELETED
      })

      if (isProsecutor) {
        setCases(casesWithoutDeleted)
      } else if (isJudge || isRegistrar) {
        const judgeCases = casesWithoutDeleted.filter((c: Case) => {
          // Judges should see all cases except cases with status code NEW.
          return c.state !== CaseState.NEW
        })

        setCases(judgeCases)
      } else {
        setCases([])
      }
    }
  }, [cases, isProsecutor, isJudge, isRegistrar, resCases, setCases])

  const mapCaseStateToTagVariant = (
    state: CaseState,
    isCustodyEndDateInThePast?: boolean,
  ): { color: TagVariant; text: string } => {
    switch (state) {
      case CaseState.NEW:
      case CaseState.DRAFT:
        return { color: 'red', text: 'Drög' }
      case CaseState.SUBMITTED:
        return { color: 'purple', text: 'Krafa send' }
      case CaseState.RECEIVED:
        return { color: 'darkerMint', text: 'Krafa móttekin' }
      case CaseState.ACCEPTED:
        if (isCustodyEndDateInThePast) {
          return {
            color: 'darkerBlue',
            text: 'Lokið',
          }
        } else {
          return {
            color: 'blue',
            text: 'Virkt',
          }
        }
      case CaseState.REJECTED:
        return { color: 'rose', text: 'Kröfu hafnað' }
      default:
        return { color: 'white', text: 'Óþekkt' }
    }
  }

  const handleClick = (c: Case): void => {
    if (c.state === CaseState.ACCEPTED || c.state === CaseState.REJECTED) {
      history.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${c.id}`)
    } else if (isJudge || isRegistrar) {
      history.push(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${c.id}`)
    } else if (c.state === CaseState.RECEIVED && c.isCourtDateInThePast) {
      history.push(`${Constants.STEP_FIVE_ROUTE}/${c.id}`)
    } else {
      history.push(`${Constants.STEP_ONE_ROUTE}/${c.id}`)
    }
  }

  const requestSort = (key: keyof Case) => {
    let d: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      d = 'descending'
    }
    setSortConfig({ key, direction: d })
  }

  const getClassNamesFor = (name: keyof Case) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const deleteCase = async (caseToDelete: Case) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED
    ) {
      const transitionRequest = parseTransition(
        caseToDelete.modified,
        CaseTransition.DELETE,
      )

      try {
        const { data } = await transitionCaseMutation({
          variables: { input: { id: caseToDelete.id, ...transitionRequest } },
        })
        if (!data) {
          return
        }

        setRequestToRemoveIndex(undefined)

        setTimeout(() => {
          setCases(
            cases?.filter((c: Case) => {
              return c !== caseToDelete
            }),
          )
        }, 800)

        clearTimeout()

        const sent = await sendNotification(caseToDelete.id)

        if (!sent) {
          // TODO: Handle error
        }
      } catch (e) {
        // TODO: Handle error
      }
    }
  }

  return (
    <div className={styles.detentionRequestsContainer}>
      {user && (
        <div className={styles.logoContainer}>
          <Logo />
          {isProsecutor && (
            <DropdownMenu
              menuLabel="Tegund kröfu"
              icon="add"
              items={[
                {
                  href: Constants.STEP_ONE_NEW_DETENTION_ROUTE,
                  title: 'Gæsluvarðhald',
                },
                {
                  href: Constants.STEP_ONE_NEW_TRAVEL_BAN_ROUTE,
                  title: 'Farbann',
                },
              ]}
              title="Stofna nýja kröfu"
            />
          )}
        </div>
      )}
      {cases ? (
        <>
          <Box marginBottom={3}>
            {/**
             * This should be a <caption> tag inside the table but
             * Safari has a bug that doesn't allow that. See more
             * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
             */}
            <Text variant="h3" id="tableCaption">
              Gæsluvarðhaldskröfur
            </Text>
          </Box>
          <table
            className={styles.detentionRequestsTable}
            data-testid="detention-requests-table"
            aria-describedby="tableCation"
          >
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    LÖKE málsnr.
                  </Text>
                </th>
                <th className={cn(styles.th, styles.largeColumn)}>
                  <Box
                    component="button"
                    display="flex"
                    alignItems="center"
                    className={styles.thButton}
                    onClick={() => requestSort('accusedName')}
                  >
                    <Text fontWeight="regular">Sakborningur</Text>
                    <Box
                      className={cn(styles.sortIcon, {
                        [styles.sortAccusedNameAsc]:
                          getClassNamesFor('accusedName') === 'ascending',
                        [styles.sortAccusedNameDes]:
                          getClassNamesFor('accusedName') === 'descending',
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
                <th className={styles.th}>
                  <Box
                    component="button"
                    display="flex"
                    alignItems="center"
                    className={styles.thButton}
                    onClick={() => requestSort('created')}
                  >
                    <Text fontWeight="regular">Krafa stofnuð</Text>
                    <Box
                      className={cn(styles.sortIcon, {
                        [styles.sortCreatedAsc]:
                          getClassNamesFor('created') === 'ascending',
                        [styles.sortCreatedDes]:
                          getClassNamesFor('created') === 'descending',
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
                    Tegund
                  </Text>
                </th>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    Staða
                  </Text>
                </th>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    Gildir til
                  </Text>
                </th>
                <th></th>
                {isProsecutor && <th></th>}
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <tr
                  key={i}
                  className={cn(
                    styles.tableRowContainer,
                    requestToRemoveIndex === i && 'isDeleting',
                  )}
                  data-testid="detention-requests-table-row"
                  role="button"
                  aria-label="Opna kröfu"
                  onClick={() => {
                    handleClick(c)
                  }}
                >
                  <td className={styles.td}>
                    <Text as="span">{c.policeCaseNumber || '-'}</Text>
                  </td>
                  <td className={cn(styles.td, styles.largeColumn)}>
                    <Text>
                      <Box component="span" className={styles.accusedName}>
                        {c.accusedName || '-'}
                      </Box>
                    </Text>
                    <Text>
                      {c.accusedNationalId && (
                        <Text as="span" variant="small" color="dark400">
                          {`kt: ${
                            insertAt(
                              c.accusedNationalId.replace('-', ''),
                              '-',
                              6,
                            ) || '-'
                          }`}
                        </Text>
                      )}
                    </Text>
                  </td>
                  <td className={styles.td}>
                    <Text as="span">
                      {format(parseISO(c.created), 'd.M.y', {
                        locale: localeIS,
                      })}
                    </Text>
                  </td>
                  <td className={styles.td}>
                    <Box component="span" display="flex" flexDirection="column">
                      <Text as="span">
                        {c.type === CaseType.CUSTODY
                          ? 'Gæsluvarðhald'
                          : 'Farbann'}
                      </Text>
                      {c.parentCase && (
                        <Text as="span" variant="small" color="dark400">
                          Framlenging
                        </Text>
                      )}
                    </Box>
                  </td>
                  <td className={styles.td} data-testid="tdTag">
                    <Tag
                      variant={
                        mapCaseStateToTagVariant(
                          c.state,
                          c.isCustodyEndDateInThePast,
                        ).color
                      }
                      outlined
                      disabled
                    >
                      {
                        mapCaseStateToTagVariant(
                          c.state,
                          c.isCustodyEndDateInThePast,
                        ).text
                      }
                    </Tag>
                  </td>
                  <td className={styles.td}>
                    <Text as="span">
                      {c.custodyEndDate && c.state === CaseState.ACCEPTED
                        ? `${formatDate(c.custodyEndDate, 'P')}`
                        : null}
                    </Text>
                  </td>
                  <td className={cn(styles.td, 'secondLast')}>
                    {isProsecutor &&
                      (c.state === CaseState.NEW ||
                        c.state === CaseState.DRAFT ||
                        c.state === CaseState.SUBMITTED ||
                        c.state === CaseState.RECEIVED) && (
                        <Box
                          data-testid="deleteCase"
                          component="button"
                          aria-label="Viltu afturkalla kröfu?"
                          className={styles.deleteButton}
                          onClick={(evt) => {
                            evt.stopPropagation()
                            setRequestToRemoveIndex(
                              requestToRemoveIndex === i ? undefined : i,
                            )
                          }}
                        >
                          <Icon icon="close" color="blue400" />
                        </Box>
                      )}
                  </td>
                  <td
                    className={cn(
                      styles.deleteButtonContainer,
                      styles.td,
                      requestToRemoveIndex === i && 'open',
                    )}
                  >
                    <Button
                      colorScheme="destructive"
                      size="small"
                      onClick={(evt) => {
                        evt.stopPropagation()
                        deleteCase(cases[i])
                      }}
                    >
                      <Box as="span" className={styles.deleteButtonText}>
                        Afturkalla
                      </Box>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : error ? (
        <div
          className={styles.detentionRequestsError}
          data-testid="detention-requests-error"
        >
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
            type="error"
          />
        </div>
      ) : loading ? (
        <Box className={styles.detentionRequestsTable}>
          <Loading />
        </Box>
      ) : null}
    </div>
  )
}

export default DetentionRequests
