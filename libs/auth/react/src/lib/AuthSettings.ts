import { storageFactory } from '@island.is/shared/utils'
import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts'

export interface AuthSettings
  extends Omit<UserManagerSettings, 'scope' | 'redirect_uri'> {
  /*
   * Used to create redirect uris. Should not end with slash.
   * Default: window.location.origin
   */
  baseUrl?: string

  /*
   * Used to handle login callback and to build a default value for `redirect_uri` with baseUrl. Should be
   * relative from baseUrl and start with a "/".
   * Default: "/auth/callback"
   */
  redirectPath?: string

  /**
   * Used to handle login callback and to build a default value for `silent_redirect_uri` with baseUrl.
   * Should be relative from baseUrl and start with a "/".
   * Default: "/auth/callback-silent"
   */
  redirectPathSilent?: string

  /**
   * Used to support login flow triggered by the authorisation server or another party. Should be relative from baseUrl
   * and start with a "/".
   * More information: https://openid.net/specs/openid-connect-standard-1_0-21.html#client_Initiate_login
   * Default: undefined
   */
  initiateLoginPath?: string

  /**
   * Prefix for storing user access tokens in session storage.
   */
  userStorePrefix?: string

  /**
   * Allow to pass the scope as an array.
   */
  scope?: string[]

  /**
   * Which URL to send the user to after switching users.
   */
  switchUserRedirectUrl?: string

  /**
   * Which PATH on the AUTHORITY to use for checking the session expiry.
   */
  checkSessionPath?: string
}

export const mergeAuthSettings = (settings: AuthSettings): AuthSettings => {
  const baseUrl = settings.baseUrl ?? window.location.origin
  const redirectPath = settings.redirectPath ?? '/auth/callback'
  const redirectPathSilent =
    settings.redirectPathSilent ?? '/auth/callback-silent'

  // Many Open ID Connect features only work when on the same domain as the IDS (with first party cookies)
  const onIdsDomain = /(is|dev)land.is$/.test(window.location.origin)

  return {
    baseUrl,
    redirectPath,
    redirectPathSilent,
    automaticSilentRenew: false,
    checkSessionPath: '/connect/sessioninfo',
    silent_redirect_uri: `${baseUrl}${redirectPathSilent}`,
    post_logout_redirect_uri: baseUrl,
    response_type: 'code',
    revokeTokenTypes: ['refresh_token'],
    revokeTokensOnSignout: true,
    loadUserInfo: true,
    monitorSession: onIdsDomain,
    userStore: new WebStorageStateStore({
      store: storageFactory(() => sessionStorage),
      prefix: settings.userStorePrefix,
    }),
    mergeClaims: true,
    ...settings,
  }
}
