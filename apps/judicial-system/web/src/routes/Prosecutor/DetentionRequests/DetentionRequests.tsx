import React, { useEffect, useState, useContext } from 'react'
import { format, parseISO } from 'date-fns'

import localeIS from 'date-fns/locale/is'

import {
  JudgeLogo,
  ProsecutorLogo,
} from '@island.is/judicial-system-web/src/shared-components/Logos'
import {
  AlertMessage,
  Button,
  Typography,
  Tag,
  TagVariant,
  Box,
} from '@island.is/island-ui/core'
import { CaseState } from '@island.is/judicial-system/types'
import { DetentionRequest, User } from '../../../types'
import * as api from '../../../api'
import * as styles from './DetentionRequests.treat'
import { UserRole } from '../../../utils/authenticate'
import * as Constants from '../../../utils/constants'
import { Link } from 'react-router-dom'
import { userContext } from '../../../utils/userContext'

interface DetentionRequestsProps {
  onGetUser: (user: User) => void
}

export const DetentionRequests: React.FC<DetentionRequestsProps> = ({
  onGetUser,
}: DetentionRequestsProps) => {
  const [cases, setCases] = useState<DetentionRequest[]>(null)
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const uContext = useContext(userContext)

  useEffect(() => {
    let isMounted = true

    async function getData() {
      const userResponse = await api.getUser()

      if (isMounted && userResponse) {
        setUser({
          nationalId: userResponse.nationalId,
          role: userResponse.role,
        })

        onGetUser({
          nationalId: userResponse.nationalId,
          role: userResponse.role,
        })
      }
    }
    if (!user) {
      getData()
    }

    return () => {
      isMounted = false
    }
  }, [user, onGetUser])

  useEffect(() => {
    async function getCases(user: User) {
      const cases = await api.getCases()

      if (user.role === UserRole.JUDGE) {
        const judgeCases = cases.filter((c) => {
          // Judges should see all cases excpet drafts
          return c.state !== CaseState.DRAFT
        })

        setCases(judgeCases)
      } else {
        setCases(cases)
      }

      setIsLoading(false)
    }

    if (user) {
      getCases(user)
    }
  }, [user])

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
      <div className={styles.logoContainer}>
        {!uContext.user ? null : uContext.user.role === UserRole.JUDGE ? (
          <JudgeLogo />
        ) : (
          <ProsecutorLogo />
        )}
      </div>
      <div className={styles.addDetentionRequestButtonContainer}>
        <Link to={Constants.STEP_ONE_ROUTE} style={{ textDecoration: 'none' }}>
          <Button
            icon="plus"
            onClick={() => window.localStorage.removeItem('workingCase')}
          >
            Stofna nýja kröfu
          </Button>
        </Link>
      </div>
      {isLoading ? null : cases ? (
        <table
          className={styles.detentionRequestsTable}
          data-testid="detention-requests-table"
        >
          <Typography as="caption" variant="h3">
            <Box marginBottom={2}>Gæsluvarðhaldskröfur</Box>
          </Typography>
          <thead>
            <tr>
              <th>LÖKE málsnr.</th>
              <th>Fullt nafn</th>
              <th>Kennitala</th>
              <th>Krafa stofnuð</th>
              <th>Staða</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr key={i} data-testid="detention-requests-table-row">
                <td>{c.policeCaseNumber || '-'}</td>
                <td>{c.accusedName}</td>
                <td>{c.accusedNationalId || '-'}</td>
                <td>
                  {format(parseISO(c.created), 'PP', { locale: localeIS })}
                </td>
                <td>
                  <Tag variant={mapCaseStateToTagVariant(c.state).color} label>
                    {mapCaseStateToTagVariant(c.state).text}
                  </Tag>
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
                        style={{ textDecoration: 'none' }}
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
