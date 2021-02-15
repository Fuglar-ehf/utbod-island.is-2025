import React, { useContext } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

import { api } from '@island.is/judicial-system-web/src/services'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import * as styles from './Header.treat'

interface Props {
  pathname: string
}

const Header: React.FC<Props> = (props: Props) => {
  const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <header className={`${styles.header}`}>
      <Link
        to={Constants.REQUEST_LIST_ROUTE}
        style={{ textDecoration: 'none' }}
        data-testid="link-to-home"
      >
        <Box display="flex" alignItems="center">
          <div className={styles.islandIsApplicationLogoWrapper}>
            <Logo width={146} />
          </div>
          {props.pathname !== '/' && (
            <>
              {/* Text does not allow className prop so we need to do this on a separate span */}
              <span className={styles.headerDiviter} />
              <span className={styles.headerTextWrapper}>
                <Text>Réttarvörslugátt</Text>
              </span>
            </>
          )}
        </Box>
      </Link>
      {isAuthenticated && (
        <Button
          variant="ghost"
          icon="logOut"
          iconType="outline"
          size="small"
          onClick={() => {
            api.logOut()
            setUser && setUser(undefined)
          }}
          data-testid="logout-button"
        >
          {user?.name}
        </Button>
      )}
    </header>
  )
}

export default Header
