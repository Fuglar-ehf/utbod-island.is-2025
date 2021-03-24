export enum ApplicationTypes {
  EXAMPLE = 'ExampleForm',
  PASSPORT = 'Passport',
  DRIVING_LESSONS = 'DrivingLessons',
  DRIVING_LICENSE = 'DrivingLicense',
  PARENTAL_LEAVE = 'ParentalLeave',
  META_APPLICATION = 'MetaApplication',
  DOCUMENT_PROVIDER_ONBOARDING = 'DocumentProviderOnboarding',
  HEALTH_INSURANCE = 'HealthInsurance',
  CHILDREN_RESIDENCE_CHANGE = 'ChildrenResidenceChange',
  DATA_PROTECTION_AUTHORITY_COMPLAINT = 'DataProtectionAuthorityComplaint',
  PARTY_LETTER = 'PartyLetter',
  PARTY_APPLICATION = 'PartyApplication',
}

<<<<<<< HEAD
export const ApplicationTranslations = {
  ExampleForm: 'example.application',
  Passport: null,
  DrivingLessons: 'dl.application',
  DrivingLicense: 'dl.application',
  ParentalLeave: 'pl.application',
  MetaApplication: null,
  DocumentProviderOnboarding: 'dpo.application',
  HealthInsurance: 'hi.application',
  ChildrenResidenceChange: 'crc.application',
  DataProtectionAuthorityComplaint: 'dpac.application',
  PartyLetter: 'ple.application',
  PartyApplication: 'pa.application',
=======
export const ApplicationConfigurations = {
  [ApplicationTypes.EXAMPLE]: {
    slug: 'example',
    translation: 'example.application',
  },
  [ApplicationTypes.PASSPORT]: {
    slug: 'vegabref',
    translation: 'pp.application',
  },
  [ApplicationTypes.DRIVING_LESSONS]: {
    slug: 'okunam',
    translation: 'dl.application',
  },
  [ApplicationTypes.DRIVING_LICENSE]: {
    slug: 'okuskirteini',
    translation: 'dl.application',
  },
  [ApplicationTypes.PARENTAL_LEAVE]: {
    slug: 'faedingarorlof',
    translation: 'pl.application',
  },
  [ApplicationTypes.META_APPLICATION]: {
    slug: 'adild-ad-umsoknakerfi',
    translation: 'meta.application',
  },
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: {
    slug: 'skjalaveita',
    translation: 'dpo.application',
  },
  [ApplicationTypes.HEALTH_INSURANCE]: {
    slug: 'sjukratryggingar',
    translation: 'hi.application',
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: {
    slug: 'breytt-logheimili-barns',
    translation: 'crc.application',
  },
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: {
    slug: 'kvortun-til-personuverndar',
    translation: 'dpac.application',
  },
  [ApplicationTypes.PARTY_LETTER]: {
    slug: 'listabokstafur',
    translation: 'ple.application',
  },
>>>>>>> main
}
