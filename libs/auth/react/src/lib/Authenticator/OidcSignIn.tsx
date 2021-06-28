import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import AuthenticatorLoadingScreen from './AuthenticatorLoadingScreen'
import AuthenticatorErrorScreen from './AuthenticatorErrorScreen'
import { getUserManager } from '../userManager'
import { ActionType, AuthDispatch } from './Authenticator.state'

interface Props {
  authDispatch: AuthDispatch
}

export const OidcSignIn = ({ authDispatch }: Props): ReactElement => {
  const history = useHistory()
  const [hasError, setHasError] = useState(false)

  const init = async function init() {
    const userManager = getUserManager()
    try {
      const user = await userManager.signinRedirectCallback(
        window.location.href,
      )

      authDispatch({ type: ActionType.SIGNIN_SUCCESS, payload: user })

      const url = typeof user.state === 'string' ? user.state : '/'
      history.push(url)
    } catch (error) {
      console.error('Error in oidc callback', error)
      setHasError(true)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return hasError ? (
    <AuthenticatorErrorScreen />
  ) : (
    <AuthenticatorLoadingScreen />
  )
}

export default OidcSignIn
