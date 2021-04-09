import { gql } from '@apollo/client'

export const CaseQuery = gql`
  query CaseQuery($input: CaseQueryInput!) {
    case(input: $input) {
      id
      created
      modified
      type
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      defenderName
      defenderEmail
      sendRequestToDefender
      court
      arrestDate
      requestedCourtDate
      requestedCustodyEndDate
      otherDemands
      lawsBroken
      custodyProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      witnessAccounts
      investigationProgress
      legalArguments
      comments
      prosecutor {
        id
        name
        title
        institution {
          name
        }
      }
      setCourtCaseNumberManually
      courtCaseNumber
      courtDate
      isCourtDateInThePast
      courtRoom
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      courtDocuments
      additionToConclusion
      accusedPleaDecision
      accusedPleaAnnouncement
      litigationPresentations
      ruling
      decision
      custodyEndDate
      isCustodyEndDateInThePast
      custodyRestrictions
      otherRestrictions
      isolationTo
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      rulingDate
      judge {
        id
        name
        title
      }
      registrar {
        id
        name
        title
      }
      parentCase {
        id
        custodyEndDate
        decision
        courtCaseNumber
        ruling
      }
      childCase {
        id
      }
      notifications {
        type
      }
      files {
        id
        name
        size
      }
    }
  }
`

export const UpdateCaseMutation = gql`
  mutation UpdateCaseMutation($input: UpdateCaseInput!) {
    updateCase(input: $input) {
      id
      modified
    }
  }
`

export const TransitionCaseMutation = gql`
  mutation TransitionCaseMutation($input: TransitionCaseInput!) {
    transitionCase(input: $input) {
      id
      modified
      state
      prosecutor {
        name
        title
      }
      judge {
        name
        title
      }
    }
  }
`

export const SendNotificationMutation = gql`
  mutation SendNotificationMutation($input: SendNotificationInput!) {
    sendNotification(input: $input) {
      notificationSent
    }
  }
`

export const CreatePresignedPostMutation = gql`
  mutation CreatePresignedPostMutation($input: CreatePresignedPostInput!) {
    createPresignedPost(input: $input) {
      url
      fields
    }
  }
`

export const CreateFileMutation = gql`
  mutation CreateFileMutation($input: CreateFileInput!) {
    createFile(input: $input) {
      id
      created
      caseId
      name
      key
      size
    }
  }
`

export const DeleteFileMutation = gql`
  mutation DeleteFileMutation($input: DeleteFileInput!) {
    deleteFile(input: $input) {
      success
    }
  }
`

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlInput!) {
    getSignedUrl(input: $input) {
      url
    }
  }
`
