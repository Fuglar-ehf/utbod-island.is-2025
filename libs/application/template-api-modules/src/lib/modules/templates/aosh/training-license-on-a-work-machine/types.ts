export interface Applicant {
  nationalId: string
  name: string
  phoneNumber: string
  email: string
  postalCode: number
  isSelfEmployed: boolean
}

export interface Company {
  companyName: string
  companyNationalId: string
  contactNationalId: string
  contactName: string
  contactPhoneNumber: string
  contactEmail: string
}

export interface CertificateOfTenure {
  machineRegistrationNumber: string
  licenseCategoryPrefix: string
  machineType: string
  dateWorkedOnMachineFrom: Date
  dateWorkedOnMachineTo: Date
  hoursWorkedOnMachine: number
}
