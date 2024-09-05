export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx']

export const FILE_SIZE_LIMIT = 10000000

export const VERDSKRA_LINK =
  'https://www.stjornartidindi.is/PdfVersions.aspx?recordId=0f574646-eb9d-430b-bbe7-936e7c9389a0'

export enum AnswerOption {
  YES = 'yes',
  NO = 'no',
}

export enum ApplicationAttachmentType {
  ORIGINAL = 'frumrit',
  ADDITIONS = 'fylgiskjol',
}

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10

export const MINIMUM_WEEKDAYS = 10

export enum Routes {
  REQUIREMENTS = 'requirements',
  COMMENTS = 'comments',
  ADVERT = 'advert',
  SIGNATURE = 'signature',
  ATTACHMENTS = 'attachments',
  PREVIEW = 'preview',
  ORIGINAL = 'original',
  PUBLISHING = 'publishing',
  SUMMARY = 'summary',
  COMPLETE = 'complete',
  MISC = 'misc',
}

// this will be replaced with correct values once the api is ready

export enum TypeIds {
  GJALDSKRA = '0',
  AUGLYSING = '1',
  REGLUGERDIR = '2',
  SKIPULAGSSKRA = '3',
}

export const MEMBER_INDEX = '{memberIndex}'
export const SIGNATURE_INDEX = '{institutionIndex}'

export const INTERVAL_TIMER = 3000
export const DEBOUNCE_INPUT_TIMER = 333

export enum FileNames {
  DOCUMENT = 'document',
  ADDITIONS = 'additions',
}

export const OJOI_INPUT_HEIGHT = 64

export type SignatureType = 'regular' | 'committee'
export enum SignatureTypes {
  REGULAR = 'regular',
  COMMITTEE = 'committee',
}

export const ONE = 1
export const MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT = 1
export const DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT = 1
export const MAXIMUM_REGULAR_SIGNATURE_MEMBER_COUNT = 10
export const MINIMUM_REGULAR_SIGNATURE_COUNT = 1
export const DEFAULT_REGULAR_SIGNATURE_COUNT = 1
export const MAXIMUM_REGULAR_SIGNATURE_COUNT = 3
export const MINIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT = 2
export const DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT = 2
export const MAXIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT = 10
