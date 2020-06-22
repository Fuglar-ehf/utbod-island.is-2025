import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
    application: CompanyApplication
  }

  type ApplicationLog {
    id: String!
    created: String
    state: String!
    title: String!
    data: String
    authorSSN: String
  }

  type CompanyApplication {
    id: String
    name: String
    email: String
    state: String!
    companySSN: String!
    serviceCategory: String
    generalEmail: String
    companyDisplayName: String
    companyName: String
    exhibition: Boolean
    operatingPermitForRestaurant: Boolean
    operatingPermitForVehicles: Boolean
    operationsTrouble: Boolean
    phoneNumber: String
    validLicenses: Boolean
    validPermit: Boolean
    webpage: String
    publicHelpAmount: Int
    logs: [ApplicationLog]
  }

  input CreateCompanyApplicationInput {
    email: StringTrimmed!
    generalEmail: StringTrimmed!
    phoneNumber: StringTrimmed!
    operationsTrouble: Boolean!
    companySSN: StringTrimmed!
    name: StringTrimmed!
    serviceCategory: StringTrimmed!
    webpage: StringTrimmed!
    companyName: StringTrimmed!
    companyDisplayName: StringTrimmed!
    operatingPermitForRestaurant: Boolean!
    exhibition: Boolean!
    operatingPermitForVehicles: Boolean!
    validLicenses: Boolean!
    validPermit: Boolean!
    publicHelpAmount: Int!
  }

  input ApproveCompanyApplicationInput {
    id: String!
  }

  input RejectCompanyApplicationInput {
    id: String!
  }

  input UpdateCompanyApplicationInput {
    id: String!
    webpage: String
    generalEmail: String
    email: String
    phoneNumber: String
    name: String
  }

  type CreateCompanyApplication {
    application: CompanyApplication
  }

  type ApproveCompanyApplication {
    application: CompanyApplication
  }

  type RejectCompanyApplication {
    application: CompanyApplication
  }

  type UpdateCompanyApplication {
    application: CompanyApplication
  }

  extend type Query {
    companyApplications: [CompanyApplication]
    companyApplication(id: String!): CompanyApplication
    companies: [Company]
    company(ssn: String!): Company
  }

  extend type Mutation {
    createCompanyApplication(
      input: CreateCompanyApplicationInput!
    ): CreateCompanyApplication
    approveCompanyApplication(
      input: ApproveCompanyApplicationInput!
    ): ApproveCompanyApplication
    rejectCompanyApplication(
      input: RejectCompanyApplicationInput!
    ): RejectCompanyApplication
    updateCompanyApplication(
      input: UpdateCompanyApplicationInput!
    ): UpdateCompanyApplication
  }
`
