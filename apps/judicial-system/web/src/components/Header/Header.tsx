import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'
import Link from 'next/link'

import {
  Text,
  Box,
  Header,
  UserMenu,
  Icon,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
} from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import {
  capitalize,
  formatPhoneNumber,
} from '@island.is/judicial-system/formatters'
import { core } from './Header.strings'
import { UserRole } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import { UserContext } from '../UserProvider/UserProvider'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import { useGetLawyer } from '../../utils/hooks'
import * as styles from './Header.css'

const HeaderContainer: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isAuthenticated, user } = useContext(UserContext)

  const logoHref =
    !user || !isAuthenticated
      ? '/'
      : user.role === UserRole.DEFENDER
      ? `${constants.DEFENDER_ROUTE}/${router.query.id}`
      : user.role === UserRole.ADMIN
      ? constants.USERS_ROUTE
      : constants.CASES_ROUTE

  const handleLogout = async () => {
    await api.logout()
    window.location.assign('/')
  }

  const { practice, email, phoneNr } =
    useGetLawyer(user?.nationalId, user?.role === UserRole.DEFENDER) ?? {}

  return (
    <Box paddingX={[3, 3, 4]}>
      <GridContainer className={styles.container}>
        <GridRow>
          <GridColumn span="12/12">
            <Header
              info={{
                title: 'Dómsmálaráðuneytið',
                description: 'Réttarvörslugátt',
              }}
              logoRender={(logo) => (
                <Link href={logoHref}>
                  <a href={logoHref}>{logo}</a>
                </Link>
              )}
              headerItems={
                user && (
                  <>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        window.open(constants.FEEDBACK_FORM_URL, '_blank')
                      }
                    >
                      {formatMessage(core.headerFeedbackButtonLabel)}
                    </Button>
                    <UserMenu
                      language="is"
                      authenticated={isAuthenticated}
                      username={user.name}
                      dropdownItems={
                        <>
                          <div className={styles.dropdownItem}>
                            <Box marginRight={2}>
                              <Icon
                                icon="person"
                                type="outline"
                                color="blue400"
                              />
                            </Box>
                            <Box>
                              <Box marginBottom={2}>
                                <Text>
                                  {capitalize(
                                    user.role === UserRole.DEFENDER
                                      ? formatMessage(core.defender)
                                      : user.title,
                                  )}
                                </Text>
                              </Box>
                              <Box marginBottom={2}>
                                <Text>
                                  {capitalize(
                                    user.role === UserRole.DEFENDER
                                      ? practice
                                      : user.institution?.name,
                                  )}
                                </Text>
                              </Box>
                              <Box marginBottom={2}>
                                <Text>
                                  {formatPhoneNumber(
                                    user.role === UserRole.DEFENDER
                                      ? phoneNr
                                      : user.mobileNumber,
                                  )}
                                </Text>
                              </Box>
                              <Box>
                                <Text>
                                  {user.role === UserRole.DEFENDER
                                    ? email
                                    : user.email}
                                </Text>
                              </Box>
                            </Box>
                          </div>
                          <div className={styles.dropdownItem}>
                            <Box marginRight={2}>
                              <Icon
                                icon="informationCircle"
                                type="outline"
                                color="blue400"
                              />
                            </Box>
                            <Box>
                              {user.role === UserRole.DEFENDER ? (
                                <Text>
                                  {formatMessage(
                                    core.headerTipDisclaimerDefenders,
                                  )}
                                </Text>
                              ) : (
                                <MarkdownWrapper
                                  markdown={formatMessage(
                                    core.headerTipDisclaimer,
                                    {
                                      linkStart:
                                        '<a href="mailto:gudlaug.thorhallsdottir@dmr.is" rel="noopener noreferrer nofollow" target="_blank">gudlaug.thorhallsdottir@dmr.is',
                                      linkEnd: '</a>',
                                    },
                                  )}
                                />
                              )}
                            </Box>
                          </div>
                        </>
                      }
                      onLogout={handleLogout}
                    />
                  </>
                )
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default HeaderContainer
