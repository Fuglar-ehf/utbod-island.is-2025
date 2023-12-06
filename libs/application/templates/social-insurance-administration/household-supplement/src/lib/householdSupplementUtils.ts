import { getValueViaPath } from '@island.is/application/core'
import {
  HouseholdSupplementHousing,
  AttachmentLabel,
  MONTHS,
  AttachmentTypes,
} from './constants'
import {
  Option,
  Application,
  YesOrNo,
  YES,
  NO,
} from '@island.is/application/types'
import { householdSupplementFormMessage } from './messages'
import addMonths from 'date-fns/addMonths'
import subYears from 'date-fns/subYears'
import * as kennitala from 'kennitala'
import { FileUpload } from '../types'
import {
  Attachments,
  BankInfo,
  FileType,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const householdSupplementHousing = getValueViaPath(
    answers,
    'householdSupplement.housing',
  ) as HouseholdSupplementHousing

  const householdSupplementChildren = getValueViaPath(
    answers,
    'householdSupplement.children',
  ) as YesOrNo

  const schoolConfirmationAttachments = getValueViaPath(
    answers,
    'fileUpload.schoolConfirmation',
  ) as FileType[]

  const leaseAgreementAttachments = getValueViaPath(
    answers,
    'fileUpload.leaseAgreement',
  ) as FileType[]

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
  ) as FileType[]

  const comment = getValueViaPath(answers, 'comment') as string

  const bankAccountType = getValueViaPath(
    answers,
    'paymentInfo.bankAccountType',
  ) as BankAccountType

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const iban = getValueViaPath(answers, 'paymentInfo.iban') as string

  const swift = getValueViaPath(answers, 'paymentInfo.swift') as string

  const bankName = getValueViaPath(answers, 'paymentInfo.bankName') as string

  const bankAddress = getValueViaPath(
    answers,
    'paymentInfo.bankAddress',
  ) as string

  const currency = getValueViaPath(answers, 'paymentInfo.currency') as string

  const paymentInfo = getValueViaPath(answers, 'paymentInfo') as PaymentInfo

  const tempAnswers = getValueViaPath(
    answers,
    'tempAnswers',
  ) as Application['answers']

  return {
    applicantPhonenumber,
    householdSupplementHousing,
    householdSupplementChildren,
    schoolConfirmationAttachments,
    leaseAgreementAttachments,
    selectedYear,
    selectedMonth,
    additionalAttachments,
    additionalAttachmentsRequired,
    comment,
    bankAccountType,
    bank,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
    paymentInfo,
    tempAnswers,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const cohabitants = getValueViaPath(
    externalData,
    'nationalRegistryCohabitants.data',
    [],
  ) as string[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const email = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.emailAddress',
  ) as string

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
  ) as boolean

  return {
    cohabitants,
    applicantName,
    applicantNationalId,
    bankInfo,
    email,
    currencies,
    isEligible,
  }
}

export function getYesNOOptions() {
  const options: Option[] = [
    {
      value: YES,
      label: householdSupplementFormMessage.shared.yes,
    },
    {
      value: NO,
      label: householdSupplementFormMessage.shared.no,
    },
  ]
  return options
}

export function isExistsCohabitantOlderThan25(
  externalData: Application['externalData'],
) {
  const { cohabitants, applicantNationalId } =
    getApplicationExternalData(externalData)

  let isOlderThan25 = false
  cohabitants.forEach((cohabitant) => {
    if (cohabitant !== applicantNationalId) {
      if (kennitala.info(cohabitant).age > 25) {
        isOlderThan25 = true
      }
    }
  })

  return isOlderThan25
}

export function getAttachments(application: Application) {
  const getAttachmentDetails = (
    attachmentsArr: FileType[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers } = application
  const {
    householdSupplementChildren,
    householdSupplementHousing,
    additionalAttachments,
    additionalAttachmentsRequired,
  } = getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  const fileUpload = answers.fileUpload as FileUpload
  if (householdSupplementHousing === HouseholdSupplementHousing.RENTER) {
    getAttachmentDetails(
      fileUpload?.leaseAgreement,
      AttachmentTypes.LEASE_AGREEMENT,
    )
  }
  if (householdSupplementChildren === YES) {
    getAttachmentDetails(
      fileUpload?.schoolConfirmation,
      AttachmentTypes.SCHOOL_CONFIRMATION,
    )
  }

  const additionalDocuments = [
    ...(additionalAttachments && additionalAttachments?.length > 0
      ? additionalAttachments
      : []),
    ...(additionalAttachmentsRequired &&
    additionalAttachmentsRequired?.length > 0
      ? additionalAttachmentsRequired
      : []),
  ]

  if (additionalDocuments.length > 0) {
    getAttachmentDetails(
      additionalDocuments,
      AttachmentTypes.ADDITIONAL_DOCUMENTS,
    )
  }

  return attachments
}

// returns available years. Available period is
// 2 years back in time and 6 months in the future.
export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )

  if (!applicantNationalId) return []
  const today = new Date()
  const twoYearsBackInTime = subYears(
    today.setMonth(today.getMonth() + 1),
    2,
  ).getFullYear()
  const sixMonthsInTheFuture = addMonths(new Date(), 6).getFullYear()

  return Array.from(
    Array(sixMonthsInTheFuture - (twoYearsBackInTime - 1)),
    (_, i) => {
      return {
        value: (i + twoYearsBackInTime).toString(),
        label: (i + twoYearsBackInTime).toString(),
      }
    },
  )
}

// returns available months for selected year, since available period is
// 2 years back in time and 6 months in the future.
export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )

  if (!applicantNationalId) return []
  if (!selectedYear) return []

  const twoYearsBackInTime = subYears(new Date(), 2)
  const sixMonthsInTheFuture = addMonths(new Date(), 6)

  let months = MONTHS
  if (twoYearsBackInTime.getFullYear().toString() === selectedYear) {
    months = months.slice(twoYearsBackInTime.getMonth() + 1, months.length)
  } else if (sixMonthsInTheFuture.getFullYear().toString() === selectedYear) {
    months = months.slice(0, sixMonthsInTheFuture.getMonth() + 1)
  }

  return months
}
