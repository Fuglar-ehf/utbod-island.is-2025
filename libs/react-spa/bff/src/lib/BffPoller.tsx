import { usePolling } from '@island.is/react-spa/shared'
import { BffUser } from '@island.is/shared/types'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import {
  BffBroadcastEvents,
  useBff,
  useBffBroadcaster,
  useUserInfo,
} from './bff.hooks'
import { isNewSession } from './bff.utils'

type BffPollerProps = {
  children: ReactNode
  newSessionCb(): void
  pollIntervalMS?: number
}

/**
 * BffPoller component continuously polls the user's session
 * information from the backend and broadcasts session changes across tabs
 * or windows using the BroadcastChannel API. It checks for changes in the
 * user's session data and triggers appropriate actions like displaying a
 * session expired modal when necessary.
 *
 * Features:
 * - Polls the backend at a specified interval to fetch user session data.
 * - If the user's session expires or the backend returns an error, it
 *   automatically triggers a sign-in process.
 * - If a change in user session (e.g., a new session ID) is detected, it
 *   broadcasts a message to all open tabs/windows and triggers the provided
 *   `newSessionCb` callback to handle the current tab/window.
 *
 * @param newSessionCb - Callback function to be called when a new session is detected.
 * @param pollIntervalMS - Polling interval in milliseconds. Default is 10000ms.
 *
 * @usage:
 * Wrap your application's root component with BffPoller to continuously
 * monitor the user's session and keep session state synchronized across
 * multiple tabs/windows.
 */
export const BffPoller = ({
  children,
  newSessionCb,
  pollIntervalMS = 10000,
}: BffPollerProps) => {
  const { signIn, bffUrlGenerator } = useBff()
  const userInfo = useUserInfo()
  const { postMessage } = useBffBroadcaster()

  const url = useMemo(
    () => bffUrlGenerator('/user', { no_refresh: 'true' }),
    [bffUrlGenerator],
  )

  const fetchUser = useCallback(async () => {
    const res = await fetch(url, {
      credentials: 'include',
    })

    if (!res.ok) {
      signIn()
      return
    }

    return res.json()
  }, [url, signIn])

  // Poll user data every 10 seconds
  const { data: newUser, error } = usePolling<BffUser>({
    fetcher: fetchUser,
    intervalMs: pollIntervalMS,
    waitToStartMS: 5000,
  })

  useEffect(() => {
    if (error) {
      // If user polling fails, sign in.
      signIn()
    } else if (newUser) {
      // If session has changed (e.g. delegation switch), then notifiy tabs/windows/iframes and execute the callback.
      if (isNewSession(newUser, userInfo)) {
        // Note! The tab, window, or iframe that sends this message will not receive it.
        // This is because the BroadcastChannel API does not broadcast messages to the sender.
        // Therefore we need to manually handle the new session in the current tab/window.
        postMessage({
          type: BffBroadcastEvents.NEW_SESSION,
          userInfo: newUser,
        })

        newSessionCb()
      }
    }
  }, [newUser, error, userInfo, signIn, postMessage, newSessionCb])

  return children
}
