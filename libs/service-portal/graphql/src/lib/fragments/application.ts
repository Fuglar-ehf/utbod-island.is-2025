import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignees
    state
    actionCard {
      title
      description
      tag {
        label
        variant
      }
      deleteButton
      draftTotalSteps
      draftFinishedSteps
    }
    typeId
    name
    progress
    status
  }
`
