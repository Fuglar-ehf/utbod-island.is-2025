import { gql } from '@apollo/client'

export const UpdateIndictmentCountMutation = gql`
  mutation UpdateIndictmentCount($input: UpdateIndictmentCountInput!) {
    updateIndictmentCount(input: $input) {
      id
      caseId
      policeCaseNumber
      vehicleRegistrationNumber
      offenses
      substances
      lawsBroken
      incidentDescription
      legalArguments
    }
  }
`
