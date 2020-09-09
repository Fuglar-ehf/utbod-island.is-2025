export interface NationalRegistryGeneralLookupResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  ssn: string
  name: string
  gender: 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
  lastmodified: string
  charged: boolean
  error?: string
}

type FamilyMember = {
  banlabel?: string
  ssn: string
  name: string
  address: string
  towncode: number
  postalcode: number
  city: string
}

export interface NationalRegistryFamilyLookupResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  familyssn: string
  results: FamilyMember[]
}

export interface NationalRegistryUser {
  nationalId: string
  firstName: string
  middleName: string
  lastName: string
  gender: 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
}
