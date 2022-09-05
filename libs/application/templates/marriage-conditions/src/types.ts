import { MarriageTermination } from './lib/constants'
import { dataSchema } from './lib/dataSchema'
import * as z from 'zod'

export type Individual = {
  person: {
    name: string
    nationalId: string
  }
  phone: string
  email: string
}

export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export interface MarriageConditionsFakeData {
  useFakeData?: YesOrNo
  maritalStatus: string
  genderCode: string
}

export type PersonalInfo = {
  address: string
  citizenship: string
  maritalStatus: string
  previousMarriageTermination: MarriageTermination
}

export type Ceremony = {
  date: string
  ceremonyPlace: string
  office: string
  society: string
}

export type MarriageConditionsAnswers = z.infer<typeof dataSchema>
