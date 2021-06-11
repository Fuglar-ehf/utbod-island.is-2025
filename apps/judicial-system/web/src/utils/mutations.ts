import { gql } from '@apollo/client'

export const RequestSignatureMutation = gql`
  mutation RequestSignatureMutation($input: RequestSignatureInput!) {
    requestSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export const SignatureConfirmationQuery = gql`
  query SignatureConfirmationQuery($input: SignatureConfirmationQueryInput!) {
    signatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`

export const CreateCaseMutation = gql`
  mutation CreateCaseMutation($input: CreateCaseInput!) {
    createCase(input: $input) {
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
        type
        name
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
        name
        title
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
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      judge {
        name
        title
      }
      registrar {
        name
        title
      }
      parentCase {
        id
      }
    }
  }
`

export const CreateCourtCaseMutation = gql`
  mutation CreateCourtCaseMutation($input: CreateCourtCaseInput!) {
    createCourtCase(input: $input) {
      courtCaseNumber
    }
  }
`

export const CasesQuery = gql`
  query CasesQuery {
    cases {
      id
      created
      type
      description
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      validToDate
      decision
      isValidToDateInThePast
      courtCaseNumber
      rulingDate
      courtEndTime
      parentCase {
        id
      }
    }
  }
`

export const ExtendCaseMutation = gql`
  mutation ExtendCaseMutation($input: ExtendCaseInput!) {
    extendCase(input: $input) {
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
        type
        name
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
        name
        title
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
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      judge {
        name
        title
      }
      parentCase {
        id
      }
    }
  }
`
export const CreateUserMutation = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
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

export const UsersQuery = gql`
  query UsersQuery {
    users {
      id
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

export const UserQuery = gql`
  query UserQuery($input: UserQueryInput!) {
    user(input: $input) {
      id
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

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      modified
    }
  }
`

export const InstitutionsQuery = gql`
  query InstitutionsQuery {
    institutions {
      id
      type
      name
    }
  }
`
