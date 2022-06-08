import { IdTokenClaims, User as OidcUser } from 'oidc-client-ts'

interface IdsAuthClaims {
  nationalId: string
  name: string
  idp: string
  actor?: {
    nationalId: string
    name: string
  }
}

export type User = Omit<OidcUser, 'profile'> & {
  profile: IdTokenClaims & IdsAuthClaims
}
