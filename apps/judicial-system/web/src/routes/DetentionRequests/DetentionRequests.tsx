import React, { useEffect, useState, useContext } from 'react'
import { format, parseISO } from 'date-fns'

import localeIS from 'date-fns/locale/is'

import {
  JudgeLogo,
  ProsecutorLogo,
} from '@island.is/judicial-system-web/src/shared-components/Logos'
import {
  AlertMessage,
  ButtonDeprecated as Button,
  Text,
  Tag,
  TagVariant,
  Box,
} from '@island.is/island-ui/core'
import { Case, CaseState, User } from '@island.is/judicial-system/types'
import * as styles from './DetentionRequests.treat'
import { UserRole } from '@island.is/judicial-system/types'
import * as Constants from '../../utils/constants'
import { Link } from 'react-router-dom'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { formatDate } from '@island.is/judicial-system/formatters'
import { insertAt } from '../../utils/formatters'
import { gql, useQuery } from '@apollo/client'

export const CasesQuery = gql`
  query CasesQuery {
    cases {
      id
      created
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      custodyEndDate
    }
  }
`

export const DetentionRequests: React.FC = () => {
  const [cases, setCases] = useState<Case[]>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useContext(userContext)

  const isJudge = user?.role === UserRole.JUDGE

  useEffect(() => {
    document.title = 'Allar kröfur - Réttarvörslugátt'
    window.localStorage.clear()
  }, [])

  const { data } = useQuery(CasesQuery, { fetchPolicy: 'no-cache' })
  const resCases = data?.cases

  useEffect(() => {
    async function getCases(user: User) {
      if (resCases && isJudge) {
        const judgeCases = resCases.filter((c: Case) => {
          // Judges should see all cases excpet drafts
          return c.state !== CaseState.DRAFT
        })

        setCases(judgeCases)
      } else {
        setCases(resCases)
      }

      setIsLoading(false)
    }

    if (user?.role) {
      getCases(user)
    }
  }, [user, isJudge, resCases, setCases])

  const mapCaseStateToTagVariant = (
    state: CaseState,
  ): { color: TagVariant; text: string } => {
    switch (state) {
      case CaseState.DRAFT:
        return { color: 'red', text: 'Drög' }
      case CaseState.SUBMITTED:
        return { color: 'purple', text: 'Krafa staðfest' }
      case CaseState.ACCEPTED:
        return { color: 'darkerMint', text: 'Gæsluvarðhald virkt' }
      case CaseState.REJECTED:
        return { color: 'blue', text: 'Gæsluvarðhaldi hafnað' }
      default:
        return { color: 'white', text: 'Óþekkt' }
    }
  }

  return (
    <div className={styles.detentionRequestsContainer}>
      {user && (
        <div className={styles.logoContainer}>
          {isJudge ? <JudgeLogo /> : <ProsecutorLogo />}
          {!isJudge && (
            <Link
              to={Constants.STEP_ONE_ROUTE}
              style={{ textDecoration: 'none' }}
            >
              <Button
                icon="plus"
                onClick={() => window.localStorage.removeItem('workingCase')}
              >
                Stofna nýja kröfu
              </Button>
            </Link>
          )}
        </div>
      )}
      {isLoading ? null : cases ? (
        <table
          className={styles.detentionRequestsTable}
          data-testid="detention-requests-table"
        >
          <Text as="caption" variant="h3">
            <Box marginBottom={3}>Gæsluvarðhaldskröfur</Box>
          </Text>
          <thead>
            <tr>
              <th>LÖKE málsnr.</th>
              <th>Fullt nafn</th>
              <th>Kennitala</th>
              <th>Krafa stofnuð</th>
              <th>Staða</th>
              <th>Gæsluvarðhald til</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr
                key={i}
                className={styles.detentionRequestsTableRow}
                data-testid="detention-requests-table-row"
              >
                <td>{c.policeCaseNumber || '-'}</td>
                <td>{c.accusedName || '-'}</td>
                <td>
                  {insertAt(c.accusedNationalId.replace('-', ''), '-', 6) ||
                    '-'}
                </td>
                <td>
                  {format(parseISO(c.created), 'PP', { locale: localeIS })}
                </td>
                <td>
                  <Tag variant={mapCaseStateToTagVariant(c.state).color} label>
                    {mapCaseStateToTagVariant(c.state).text}
                  </Tag>
                </td>
                <td>
                  {c.state === CaseState.ACCEPTED
                    ? formatDate(c.custodyEndDate, 'PP')
                    : null}
                </td>
                <td>
                  <userContext.Consumer>
                    {(user) => (
                      <Link
                        to={
                          user.user.role === UserRole.JUDGE
                            ? `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${c.id}`
                            : `${Constants.SINGLE_REQUEST_BASE_ROUTE}/${c.id}`
                        }
                        style={{
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Button icon="arrowRight" variant="text">
                          Opna kröfu
                        </Button>
                      </Link>
                    )}
                  </userContext.Consumer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          className={styles.detentionRequestsError}
          data-testid="detention-requests-error"
        >
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar"
            type="error"
          />
        </div>
      )}
    </div>
  )
}

export default DetentionRequests
