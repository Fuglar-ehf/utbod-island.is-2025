import { FieldBaseProps, FormText } from '@island.is/application/core'

export enum StatusTypes {
  PENSIONER = 'pensioner',
  STUDENT = 'student',
  OTHER = 'other',
  EMPLOYED = 'employed',
}

export interface AdditionalInfoType {
  remarks: string
  files?: string[]
  hasAdditionalInfo?: string
}

export interface MissingInfoType {
  date: string
  remarks: string
  files?: string[]
}

export interface ReviewFieldProps extends FieldBaseProps {
  isEditable: boolean
  index?: number
}

export interface ContentType {
  title: FormText
  description: FormText | (() => void)
  buttonText: FormText
  buttonAction: () => void
}
