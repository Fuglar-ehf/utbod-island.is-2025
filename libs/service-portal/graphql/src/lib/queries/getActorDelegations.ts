import { gql } from '@apollo/client'

export const ACTOR_DELEGATIONS = gql`
  query ActorDelegations {
    authActorDelegations {
      fromNationalId
      fromName
    }
  }
`
