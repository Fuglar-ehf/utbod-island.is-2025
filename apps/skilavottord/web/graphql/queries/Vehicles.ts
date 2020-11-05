import gql from 'graphql-tag'

export const VEHICLES_BY_NATIONAL_ID = gql`
  query skilavottordVehicles($nationalId: String!) {
    skilavottordVehicles(nationalId: $nationalId) {
      permno
      type
      color
      firstRegDate
      isRecyclable
      hasCoOwner
      status
    }
  }
`
