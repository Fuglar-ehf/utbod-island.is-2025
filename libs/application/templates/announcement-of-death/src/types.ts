export enum RoleConfirmationEnum {
  CONTINUE = 'continue',
  DELEGATE = 'delegate',
}

export enum RelationEnum {
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  SPOUSE = 'spouse',
}

export interface ElectPersonType {
  roleConfirmation: RoleConfirmationEnum
  electedPersonName?: string
  electedPersonNationalId?: string
  lookupError?: boolean
}

export interface EstateMember {
  name: string
  nationalId: string
  relation: RelationEnum
  hasForeignCitizenship?: boolean
}

export interface Property {
  propertyNumber: string
  address?: string
}

export interface Vehicle {
  plateNumber: string
  numberOfWheels: number
  weight: number
  year: number
}

export interface Will {
  nationalId: string
  hasWill: boolean
}

export interface Prenup {
  nationalId: string
  partnerNationalId: string
  hasPrenup: boolean
}
