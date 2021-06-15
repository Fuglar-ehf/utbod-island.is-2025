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
      isAccusedAbsent
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
      isolationToDate
      additionToConclusion
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
