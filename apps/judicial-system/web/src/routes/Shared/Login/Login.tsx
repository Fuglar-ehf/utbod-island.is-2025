import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Text, Button, Box, AlertMessage } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import { LoginErrorCodes } from '@island.is/judicial-system-web/src/types'
import { login } from '@island.is/judicial-system-web/messages'
import { useRouter } from 'next/router'
import * as styles from './Login.css'

const Login = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  useEffect(() => {
    document.title = 'Réttarvörslugátt'
  }, [])

  const getErrorAlert = (errorCode: LoginErrorCodes): JSX.Element | null => {
    switch (errorCode) {
      case LoginErrorCodes.LOGIN_FAILED:
        return (
          <AlertMessage
            type="warning"
            title={formatMessage(login.error.failed.title)}
            message={formatMessage(login.error.failed.message)}
          />
        )
      case LoginErrorCodes.UNAUTHENTICATED:
        return (
          <AlertMessage
            type="info"
            title={formatMessage(login.error.unAuthenticated.title)}
            message={formatMessage(login.error.unAuthenticated.message)}
          />
        )
      case LoginErrorCodes.UNAUTHORIZED:
        return (
          <AlertMessage
            type="warning"
            title={formatMessage(login.error.unAuthorized.title)}
            message={formatMessage(login.error.unAuthorized.message)}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.loginContainer}>
      {router.query.villa && (
        <div className={styles.errorMessage}>
          <Box marginBottom={6}>
            {getErrorAlert(router.query.villa as LoginErrorCodes)}
          </Box>
        </div>
      )}
      <div className={styles.titleContainer}>
        <Box>
          <Text as="h1" variant="h1">
            {formatMessage(login.general.heading)}
          </Text>
        </Box>
      </div>
      <div className={styles.subTitleContainer}>
        <Text>{formatMessage(login.general.description)}</Text>
      </div>
      <div className={styles.buttonContainer}>
        <a
          href={`${api.apiUrl}/api/auth/login`}
          role="button"
          rel="noreferrer noopener"
          className={styles.btn}
        >
          <Button fluid>{formatMessage(login.general.buttonLabel)}</Button>
        </a>
      </div>
    </div>
  )
}

export default Login
