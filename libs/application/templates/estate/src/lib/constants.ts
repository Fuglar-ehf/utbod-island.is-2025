import { DefaultEvents } from '@island.is/application/types'

export const YES = 'Yes'
export const NO = 'No'

export const JA = 'Já'
export const NEI = 'Nei'

export const UPLOAD_ACCEPT = '.pdf, .doc, .docx, .rtf'
export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum States {
  prerequisites = 'prerequisites',
  draft = 'draft',
  done = 'done',
}

export type EstateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
  APPLICANT_OFFICIAL_DIVISION = 'applicant_official_division',
  APPLICANT_NO_ASSETS = 'applicant_no_assets',
  APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE = 'applicant_permit_for_undivided_estate',
  APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS = 'applicant_division_of_estate_by_heirs',
}

export const EstateTypes = {
  officialDivision: 'Opinber skipti',
  estateWithoutAssets: 'Eignalaust dánarbú',
  permitForUndividedEstate: 'Seta í óskiptu búi',
  divisionOfEstateByHeirs: 'Einkaskipti',
}
