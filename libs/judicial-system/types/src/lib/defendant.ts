export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Defendant {
  id: string
  created: string
  modified: string
  caseId: string
  noNationalId?: boolean
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
}

export interface CreateDefendant {
  noNationalId?: boolean
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
}

export interface UpdateDefendant {
  id?: string
  noNationalId?: boolean
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
}

export interface DeleteDefendantResponse {
  deleted: boolean
}
