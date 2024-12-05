import { useEffectOnce } from '@island.is/react-spa/shared'
import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'

import { LoadingScreen } from '@island.is/react/components'
import { BffContext } from './BffContext'
import { BffPoller } from './BffPoller'
import { BffSessionExpiredModal } from './BffSessionExpiredModal'
import { ErrorScreen } from './ErrorScreen'
import { BffBroadcastEvents, useBffBroadcaster } from './bff.hooks'
import { ActionType, LoggedInState, initialState, reducer } from './bff.state'
import { createBffUrlGenerator, isNewUser } from './bff.utils'

const BFF_SERVER_UNAVAILABLE = 'BFF_SERVER_UNAVAILABLE'

type BffProviderProps = {
  children: ReactNode
  mockedInitialState?: LoggedInState
  applicationBasePath: string
  /**
   * Bff API - Global prefix path
   * @example /stjornbord/bff, etc.
   */
  bffGlobalPrefix?: string
}

export const BffProvider = ({
  children,
  applicationBasePath,
  mockedInitialState,
  bffGlobalPrefix,
}: BffProviderProps) => {
  const [showSessionExpiredScreen, setSessionExpiredScreen] = useState(false)
  const bffUrlGenerator = createBffUrlGenerator(bffGlobalPrefix)
  const [state, dispatch] = useReducer(reducer, {
    ...(mockedInitialState ?? initialState),
  })

  const { authState } = state
  const showErrorScreen = authState === 'error'
  const showLoadingScreen =
    authState === 'loading' ||
    authState === 'switching' ||
    authState === 'logging-out'
  const isLoggedIn = authState === 'logged-in'
  const oldLoginPath = `${applicationBasePath}/login`

  const { postMessage } = useBffBroadcaster((event) => {
    if (
      isLoggedIn &&
      event.data.type === BffBroadcastEvents.NEW_SESSION &&
      isNewUser(state.userInfo, event.data.userInfo)
    ) {
      setSessionExpiredScreen(true)
    } else if (event.data.type === BffBroadcastEvents.LOGOUT) {
      // We will wait 1 seconds before we dispatch logout action.
      // The reason is that IDS will not log the user out immediately.
      // Note! The bff poller may have triggered logout by that time anyways.
      setTimeout(() => {
        dispatch({
          type: ActionType.LOGGED_OUT,
        })

        signIn()
      }, 1000)
    }
  })

  useEffect(() => {
    if (isLoggedIn) {
      // Broadcast to all tabs/windows/iframes that a new session has started
      postMessage({
        type: BffBroadcastEvents.NEW_SESSION,
        userInfo: state.userInfo,
      })
    }
  }, [postMessage, state.userInfo, isLoggedIn])

  /**
   * Builds authentication query parameters for login redirection:
   * - target_link_uri: Destination URL after successful login
   *   • Uses URL from query string if provided
   *   • Falls back to current URL, with '/login' stripped if on legacy login path
   * - prompt: Optional authentication prompt type
   * - login_hint: Optional suggested account identifier
   */
  const getLoginQueryParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const targetLinkUri = urlParams.get('target_link_uri')
    const prompt = urlParams.get('prompt')
    const loginHint = urlParams.get('login_hint')
    const url = window.location.href
    const params = {
      target_link_uri:
        targetLinkUri ??
        (window.location.pathname.startsWith(oldLoginPath)
          ? // Remove `/login` from the path to prevent redirect loop
            url.replace(oldLoginPath, applicationBasePath)
          : url),
      ...(prompt && {
        prompt,
      }),
      ...(loginHint && {
        login_hint: loginHint,
      }),
    }
    console.log(url, params)

    return params
  }, [applicationBasePath, oldLoginPath])

  const checkLogin = async (noRefresh = false) => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })

    try {
      const url = bffUrlGenerator('/user', {
        refresh: noRefresh.toString(),
      })

      const res = await fetch(url, {
        credentials: 'include',
      })

      if (!res.ok) {
        // Bff server is down
        if (res.status >= 500) {
          throw new Error(BFF_SERVER_UNAVAILABLE)
        }

        // For other none ok responses, like 401/403, proceed with sign-in redirect.
        signIn()

        return
      }

      // If user is logged in and on the old login path, then start the sign-in process
      if (window.location.pathname.startsWith(oldLoginPath)) {
        signIn()

        return
      }

      const user = await res.json()

      dispatch({
        type: ActionType.SIGNIN_SUCCESS,
        payload: user,
      })
    } catch (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: error,
      })
    }
  }

  const signIn = useCallback(() => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })

    window.location.href = bffUrlGenerator('/login', getLoginQueryParams())
  }, [bffUrlGenerator, getLoginQueryParams])

  const signOut = useCallback(() => {
    if (!state.userInfo) {
      return
    }

    dispatch({
      type: ActionType.LOGGING_OUT,
    })

    // Broadcast to all tabs/windows/iframes that the user is logging out
    postMessage({
      type: BffBroadcastEvents.LOGOUT,
    })

    window.location.href = bffUrlGenerator('/logout', {
      sid: state.userInfo.profile.sid,
    })
  }, [bffUrlGenerator, postMessage, state.userInfo])

  const switchUser = useCallback(
    (nationalId?: string) => {
      dispatch({
        type: ActionType.SWITCH_USER,
      })

      const loginQueryParams = getLoginQueryParams()
      const targetLinkUri = loginQueryParams['target_link_uri']

      window.location.href = bffUrlGenerator('/login', {
        target_link_uri: targetLinkUri,
        ...(nationalId
          ? { login_hint: nationalId }
          : { prompt: 'select_account' }),
      })
    },
    [bffUrlGenerator, getLoginQueryParams],
  )

  const checkQueryStringError = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('bff_error_code')
    const errorDescription = urlParams.get('bff_error_description')

    if (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: new Error(`${error}: ${errorDescription}`),
      })
    }

    // Returns true if there is an error
    return !!error
  }

  useEffectOnce(() => {
    const hasError = checkQueryStringError()

    if (!hasError && !isLoggedIn) {
      checkLogin()
    }
  })

  const newSessionCb = useCallback(() => {
    setSessionExpiredScreen(true)
  }, [])

  const onRetry = () => {
    window.location.href = applicationBasePath
  }

  const renderContent = () => {
    if (mockedInitialState) {
      return children
    }

    if (showErrorScreen) {
      return (
        <ErrorScreen
          onRetry={onRetry}
          {...(state?.error?.message === BFF_SERVER_UNAVAILABLE && {
            title: 'Þjónusta liggur niðri',
          })}
        />
      )
    }

    if (showLoadingScreen) {
      return <LoadingScreen ariaLabel="Er að vinna í innskráningu" />
    }

    if (showSessionExpiredScreen) {
      return <BffSessionExpiredModal onLogin={signIn} />
    }

    if (isLoggedIn) {
      return <BffPoller newSessionCb={newSessionCb}>{children}</BffPoller>
    }

    return null
  }

  return (
    <BffContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        switchUser,
        bffUrlGenerator,
      }}
    >
      {renderContent()}
    </BffContext.Provider>
  )
}
