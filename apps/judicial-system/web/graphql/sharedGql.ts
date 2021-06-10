import { gql } from '@apollo/client'

export const CaseQuery = gql`
  query CaseQuery($input: CaseQueryInput!) {
    case(input: $input) {
      id
      created
      modified
      type
      description
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      defenderName
      defenderEmail
      defenderPhoneNumber
      sendRequestToDefender
      court {
        id
        name
        type
      }
      leadInvestigator
      arrestDate
      requestedCourtDate
      requestedValidToDate
      demands
      lawsBroken
      legalBasis
      custodyProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      legalArguments
      requestProsecutorOnlySession
      prosecutorOnlySessionRequest
      comments
      caseFilesComments
      prosecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      sharedWithProsecutorsOffice {
        id
        type
        name
      }
      courtCaseNumber
      courtDate
      courtRoom
      courtStartDate
      courtEndTime
      courtAttendees
      prosecutorDemands
      courtDocuments
      additionToConclusion
      accusedPleaDecision
      accusedPleaAnnouncement
      litigationPresentations
      courtCaseFacts
      courtLegalArguments
      ruling
      decision
      validToDate
      isValidToDateInThePast
      custodyRestrictions
      otherRestrictions
      isolationTo
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
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
        validToDate
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
        created
      }
      isAppealDeadlineExpired
      isAppealGracePeriodExpired
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
