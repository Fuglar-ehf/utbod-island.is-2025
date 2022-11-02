import { gql } from '@apollo/client'
import { authApiScopeFragment } from '../fragments/scope'

export const AUTH_SCOPE_TREE_QUERY = gql`
  query AuthScopeTree($input: AuthApiScopesInput!) {
    authScopeTree(input: $input) {
      __typename
      ... on AuthApiScope {
        ...AuthApiScopeFragment
      }
      ... on AuthApiScopeGroup {
        name
        displayName
        description
        children {
          ...AuthApiScopeFragment
        }
      }
    }
  }
  ${authApiScopeFragment}
`
