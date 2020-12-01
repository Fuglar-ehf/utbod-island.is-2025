import {
  UserManager,
  WebStorageStateStore,
  InMemoryWebStorage,
  UserManagerSettings,
} from 'oidc-client'
import { environment } from '../environments'

const settings: UserManagerSettings = {
  authority: environment.identityServer.IDENTITY_SERVER_ISSUER_URL,
  // eslint-disable-next-line @typescript-eslint/camelcase
  client_id: 'island-is-1',
  // eslint-disable-next-line @typescript-eslint/camelcase
  silent_redirect_uri: `${window.location.origin}/silent/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  redirect_uri: `${window.location.origin}/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  post_logout_redirect_uri: `${window.location.origin}`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  response_type: 'code',
  revokeAccessTokenOnSignout: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  scope: 'openid profile api_resource.scope',
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}

export const userManager = new UserManager(settings)
