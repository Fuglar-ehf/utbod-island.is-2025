import { NO, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  YesOrNo,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import {
  Child,
  ChildInformation,
  FriggChildInformation,
  Membership,
  Parents,
  Person,
  RelativesRow,
  SelectOption,
  SiblingsRow,
} from '../types'
import {
  ReasonForApplicationOptions,
  LanguageEnvironmentOptions,
} from './constants'

import { newPrimarySchoolMessages } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childNationalId = getValueViaPath(answers, 'childNationalId') as string

  const childInfo = getValueViaPath(answers, 'childInfo') as ChildInformation

  const differentPlaceOfResidence = getValueViaPath(
    answers,
    'childInfo.differentPlaceOfResidence',
  ) as YesOrNo

  const parents = getValueViaPath(answers, 'parents') as Parents

  const relatives = getValueViaPath(answers, 'relatives') as RelativesRow[]

  const reasonForApplication = getValueViaPath(
    answers,
    'reasonForApplication.reason',
  ) as ReasonForApplicationOptions

  const reasonForApplicationCountry = getValueViaPath(
    answers,
    'reasonForApplication.movingAbroad.country',
  ) as string

  const reasonForApplicationStreetAddress = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.streetAddress',
  ) as string

  const reasonForApplicationPostalCode = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.postalCode',
  ) as string

  const siblings = getValueViaPath(answers, 'siblings') as SiblingsRow[]

  const languageEnvironment = getValueViaPath(
    answers,
    'languages.languageEnvironment',
  ) as string

  const signLanguage = getValueViaPath(
    answers,
    'languages.signLanguage',
  ) as YesOrNo

  const language1 = getValueViaPath(answers, 'languages.language1') as string

  const language2 = getValueViaPath(answers, 'languages.language2') as string

  const language3 = getValueViaPath(answers, 'languages.language3') as string

  const language4 = getValueViaPath(answers, 'languages.language4') as string

  const language1HiddenInput = getValueViaPath(
    answers,
    'languages.hiddenLanguage1Input',
  ) as string

  const language2HiddenInput = getValueViaPath(
    answers,
    'languages.hiddenLanguage2Input',
  ) as string

  const language3HiddenInput = getValueViaPath(
    answers,
    'languages.hiddenLanguage3Input',
  ) as string

  const language4HiddenInput = getValueViaPath(
    answers,
    'languages.hiddenLanguage4Input',
  ) as string

  const childLanguage = getValueViaPath(
    answers,
    'languages.childLanguage',
  ) as string

  const interpreter = getValueViaPath(
    answers,
    'languages.interpreter',
  ) as YesOrNo

  const hasFoodAllergiesOrIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasFoodAllergiesOrIntolerances',
  ) as string[]

  const foodAllergiesOrIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.foodAllergiesOrIntolerances',
  ) as string[]

  const hasOtherAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasOtherAllergies',
  ) as string[]

  const otherAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.otherAllergies',
  ) as string[]

  const usesEpiPen = getValueViaPath(
    answers,
    'allergiesAndIntolerances.usesEpiPen',
  ) as YesOrNo

  const hasConfirmedMedicalDiagnoses = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasConfirmedMedicalDiagnoses',
  ) as YesOrNo

  const requestMedicationAssistance = getValueViaPath(
    answers,
    'allergiesAndIntolerances.requestMedicationAssistance',
  ) as YesOrNo

  const developmentalAssessment = getValueViaPath(
    answers,
    'support.developmentalAssessment',
  ) as YesOrNo

  const specialSupport = getValueViaPath(
    answers,
    'support.specialSupport',
  ) as YesOrNo

  const requestMeeting = getValueViaPath(
    answers,
    'support.requestMeeting[0]',
    NO,
  ) as YesOrNo

  const startDate = getValueViaPath(answers, 'startDate') as string

  const schoolMunicipality = getValueViaPath(
    answers,
    'schools.newSchool.municipality',
  ) as string

  const selectedSchool = getValueViaPath(
    answers,
    'schools.newSchool.school',
  ) as string

  const newSchoolHiddenInput = getValueViaPath(
    answers,
    'schools.newSchool.hiddenInput',
  ) as string

  return {
    childNationalId,
    childInfo,
    differentPlaceOfResidence,
    parents,
    relatives,
    reasonForApplication,
    reasonForApplicationCountry,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    siblings,
    languageEnvironment,
    language1,
    language2,
    language3,
    language4,
    childLanguage,
    signLanguage,
    interpreter,
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestMedicationAssistance,
    developmentalAssessment,
    specialSupport,
    requestMeeting,
    startDate,
    schoolMunicipality,
    selectedSchool,
    newSchoolHiddenInput,
    language1HiddenInput,
    language2HiddenInput,
    language3HiddenInput,
    language4HiddenInput,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const children = getValueViaPath(externalData, 'children.data', []) as Child[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.name',
    '',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
    '',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
    '',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
    '',
  ) as string

  const applicantCity = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.city',
    '',
  ) as string

  const childInformation = getValueViaPath(
    externalData,
    'childInformation.data',
  ) as FriggChildInformation

  const childGradeLevel = getValueViaPath(
    externalData,
    'childInformation.data.gradeLevel',
    '',
  ) as string

  const primaryOrgId = getValueViaPath(
    externalData,
    'childInformation.data.primaryOrgId',
    '',
  ) as string

  const childMemberships = getValueViaPath(
    externalData,
    'childInformation.data.memberships',
    [],
  ) as Membership[]

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    childInformation,
    childGradeLevel,
    primaryOrgId,
    childMemberships,
  }
}

export const getSelectedChild = (application: Application) => {
  const { childNationalId } = getApplicationAnswers(application.answers)
  const { children } = getApplicationExternalData(application.externalData)

  // Find the child name since we only have nationalId in the answers
  const selectedChild = children.find((child) => {
    return child.nationalId === childNationalId
  })
  return selectedChild
}

export const getOtherParent = (
  application: Application,
): Person | undefined => {
  const selectedChild = getSelectedChild(application)

  return selectedChild?.otherParent as Person | undefined
}

export const hasOtherParent = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const otherParent = getOtherParent({ answers, externalData } as Application)
  return !!otherParent
}

export const getSelectedOptionLabel = (
  options: SelectOption[],
  key?: string,
) => {
  if (key === undefined) {
    return undefined
  }

  return options.find((option) => option.value === key)?.label
}

export const formatGrade = (gradeLevel: string, lang: Locale) => {
  let grade = gradeLevel
  if (gradeLevel.startsWith('0')) {
    grade = gradeLevel.substring(1)
  }

  if (lang === 'en') {
    switch (grade) {
      case '1':
        return `${grade}st`
      case '2':
        return `${grade}nd`
      case '3':
        return `${grade}rd`
      default:
        return `${grade}th`
    }
  }
  return grade
}

export const getCurrentSchoolName = (application: Application) => {
  const { primaryOrgId, childMemberships } = getApplicationExternalData(
    application.externalData,
  )

  if (!primaryOrgId || !childMemberships) {
    return undefined
  }

  // Find the school name since we only have primary org id
  return childMemberships
    .map((membership) => membership.organization)
    .find((organization) => organization?.id === primaryOrgId)?.name
}

export const getLanguageEnvironments = () => {
  return [
    {
      value: LanguageEnvironmentOptions.ONLY_ICELANDIC,
      label: newPrimarySchoolMessages.differentNeeds.onlyIcelandicOption,
    },
    {
      value: LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
      label: newPrimarySchoolMessages.differentNeeds.icelandicAndOtherOption,
    },
    {
      value: LanguageEnvironmentOptions.ONLY_FOREIGN,
      label: newPrimarySchoolMessages.differentNeeds.onlyForeignOption,
    },
  ]
}

export const hasOtherLanguages = (answers: FormValue) => {
  const { languageEnvironment } = getApplicationAnswers(answers)

  if (!languageEnvironment) {
    return false
  }

  return languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
}
