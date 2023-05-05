import { gql } from '@apollo/client'

export const ProsecutorSelectionUsersQuery = gql`
  query ProsecutorSelectionUsers {
    users {
      id
      created
      modified
      name
      nationalId
      mobileNumber
      role
      title
      email
      institution {
        id
        type
        name
      }
      active
    }
  }
`
