type ValueOf<T> = T[keyof T]

export type ApplicationExchange = 'gjafakort-application-updates'

export type CompanyApplicationRoutingKey =
  | 'gjafakort:approved'
  | 'gjafakort:pending'
  | 'gjafakort:rejected'
  | 'gjafakort:manual-approved'

export type UserApplicationRoutingKey =
  | 'gjafakort-user:approved'
  | 'gjafakort-user-2:approved'

export interface ApplicationStates {
  PENDING: 'pending'
  APPROVED: 'approved'
  MANUAL_APPROVED: 'manual-approved'
  REJECTED: 'rejected'
  NONE: 'none'
}

export interface Application {
  id: string
  created: string
  modified: string

  issuerSSN: string
  type: 'gjafakort' | 'gjafakort-user' | 'gjafakort-user-2'
  state: ValueOf<ApplicationStates>
  data: object
  AuditLogs?: [
    {
      id: string
      created: string
      state: ValueOf<ApplicationStates>
      title: string
      data: string
      authorSSN: string
    },
  ]
}

export interface CompanyApplication extends Application {
  type: 'gjafakort'
  data: {
    comments: string[]
    companyDisplayName: string
    companyName: string
    companySSN: string
    email: string
    exhibition: boolean
    generalEmail: string
    name: string
    operatingPermitForRestaurant: boolean
    operatingPermitForVehicles: boolean
    operationsTrouble: boolean
    phoneNumber: string
    serviceCategory: string
    validLicenses: boolean
    validPermit: boolean
    webpage: string
    publicHelpAmount: number
  }
}

export interface UserApplication extends Application {
  type: 'gjafakort-user' | 'gjafakort-user-2'
  state: 'approved'
  data: {
    mobileNumber: string
    countryCode: string
    verified: boolean
  }
}
