import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import Logo from '../assets/Logo'
import { oldAgePensionFormMessage } from '../lib/messages'
import {
  ApplicationType,
  Employment,
  FILE_SIZE_LIMIT,
  NO,
  RatioType,
  YES,
  IS,
  maritalStatuses,
  TaxLevelOptions,
} from '../lib/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getTaxOptions,
  getYesNOOptions,
  isEarlyRetirement,
} from '../lib/oldAgePensionUtils'
import { ApplicantInfo } from '../types'

export const OldAgePensionForm: Form = buildForm({
  id: 'OldAgePensionDraft',
  title: oldAgePensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'applicant',
      title: oldAgePensionFormMessage.applicant.applicantSection,
      children: [
        buildSubSection({
          id: 'info',
          title:
            oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title:
                oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle,
              description:
                oldAgePensionFormMessage.applicant
                  .applicantInfoSubSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.name',
                  title: oldAgePensionFormMessage.applicant.applicantInfoName,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry.fullName
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.ID',
                  title: oldAgePensionFormMessage.applicant.applicantInfoId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    kennitala.format(application.applicant),
                }),
                buildTextField({
                  id: 'applicantInfo.address',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoAddress,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.streetAddress
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.postcode',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoPostalcode,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.postalCode
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.municipality',
                  title:
                    oldAgePensionFormMessage.applicant
                      .applicantInfoMunicipality,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.locality
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.email',
                  title: oldAgePensionFormMessage.applicant.applicantInfoEmail,
                  width: 'half',
                  variant: 'email',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData
                      .socialInsuranceAdministrationApplicant
                      .data as ApplicantInfo
                    return data.emailAddress
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoPhonenumber,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const data = application.externalData
                      .socialInsuranceAdministrationApplicant
                      .data as ApplicantInfo
                    return data.phoneNumber
                  },
                }),
                buildDescriptionField({
                  id: 'applicantInfo.descriptionField',
                  space: 'containerGutter',
                  titleVariant: 'h5',
                  title:
                    oldAgePensionFormMessage.applicant
                      .applicantInfoMaritalTitle,
                  condition: (answers, externalData) => {
                    const { hasSpouse } =
                      getApplicationExternalData(externalData)
                    if (hasSpouse) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.maritalStatus',
                  title:
                    oldAgePensionFormMessage.applicant
                      .applicantInfoMaritalStatus,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return maritalStatuses[data.maritalStatus]
                  },
                  condition: (_, externalData) => {
                    const { maritalStatus } =
                      getApplicationExternalData(externalData)
                    if (maritalStatus) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseName',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoSpouseName,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.name
                  },
                  condition: (_, externalData) => {
                    const { spouseName } =
                      getApplicationExternalData(externalData)
                    if (spouseName) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseID',
                  title: oldAgePensionFormMessage.applicant.applicantInfoId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return kennitala.format(data.nationalId)
                  },
                  condition: (_, externalData) => {
                    const { spouseNationalId } =
                      getApplicationExternalData(externalData)
                    if (spouseNationalId) return true
                    return false
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: oldAgePensionFormMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: oldAgePensionFormMessage.payment.title,
              description: '',
              children: [
                buildCustomField({
                  id: 'paymentInfo.bankAccountInfo',
                  title: '',
                  component: 'BankAccount',
                }),
                buildRadioField({
                  id: 'paymentInfo.personalAllowance',
                  title: oldAgePensionFormMessage.payment.personalAllowance,
                  options: getYesNOOptions(),
                  width: 'half',
                  largeButtons: true,
                  space: 'containerGutter',
                }),
                buildTextField({
                  id: 'paymentInfo.personalAllowanceUsage',
                  title:
                    oldAgePensionFormMessage.payment
                      .personalAllowancePercentage,
                  suffix: '%',
                  condition: (answers) => {
                    const { personalAllowance } = getApplicationAnswers(answers)
                    return personalAllowance === YES
                  },
                  placeholder: '1%',
                  defaultValue: '100',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
                buildRadioField({
                  id: 'paymentInfo.spouseAllowance',
                  title: oldAgePensionFormMessage.payment.spouseAllowance,
                  options: getYesNOOptions(),
                  required: true,
                  width: 'half',
                  largeButtons: true,
                  space: 'containerGutter',
                  condition: (_, externalData) => {
                    const { hasSpouse } =
                      getApplicationExternalData(externalData)
                    if (hasSpouse) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.spouseAllowanceUsage',
                  title:
                    oldAgePensionFormMessage.payment
                      .personalAllowancePercentage,
                  suffix: '%',
                  condition: (answers, externalData) => {
                    const { spouseAllowance } = getApplicationAnswers(answers)
                    const { hasSpouse } =
                      getApplicationExternalData(externalData)
                    return hasSpouse && spouseAllowance === YES
                  },
                  placeholder: '1%',
                  defaultValue: '100',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
                buildRadioField({
                  id: 'paymentInfo.taxLevel',
                  title: oldAgePensionFormMessage.payment.taxLevel,
                  options: getTaxOptions(),
                  width: 'full',
                  largeButtons: true,
                  space: 'containerGutter',
                  defaultValue: TaxLevelOptions.INCOME,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'onePaymentPerYear',
          title:
            oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
          children: [
            buildMultiField({
              id: 'onePaymentPerYear',
              title:
                oldAgePensionFormMessage.onePaymentPerYear
                  .onePaymentPerYearTitle,
              description:
                oldAgePensionFormMessage.onePaymentPerYear
                  .onePaymentPerYearDescription,
              children: [
                buildRadioField({
                  id: 'onePaymentPerYear.question',
                  title: '',
                  options: getYesNOOptions(),
                  defaultValue: NO,
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'onePaymentPerYear.alert',
                  title: oldAgePensionFormMessage.shared.alertTitle,
                  message:
                    oldAgePensionFormMessage.onePaymentPerYear
                      .onePaymentPerYearAlertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'warning',
                  condition: (answers) => {
                    const { onePaymentPerYear } = getApplicationAnswers(answers)

                    return onePaymentPerYear === YES
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'residence',
          title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
          children: [
            buildMultiField({
              id: 'residenceHistory',
              title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
              description:
                oldAgePensionFormMessage.residence.residenceHistoryDescription,
              children: [
                buildCustomField({
                  id: 'residenceHistory.table',
                  doesNotRequireAnswer: true,
                  title: '',
                  component: 'ResidenceHistory',
                  condition: (_, externalData) => {
                    const { residenceHistory } =
                      getApplicationExternalData(externalData)
                    // if no residence history returned, dont show the table
                    if (residenceHistory.length === 0) return false
                    return true
                  },
                }),
                buildRadioField({
                  id: 'residenceHistory.question',
                  title:
                    oldAgePensionFormMessage.residence.residenceHistoryQuestion,
                  options: getYesNOOptions(),
                  width: 'half',
                  largeButtons: true,
                  space: 'containerGutter',
                  condition: (_, externalData) => {
                    const { residenceHistory } =
                      getApplicationExternalData(externalData)
                    // if no residence history returned or if residence history is only iceland, show the question
                    if (residenceHistory.length === 0) return true
                    return residenceHistory.every(
                      (residence) => residence.country === IS,
                    )
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'employment',
      title: oldAgePensionFormMessage.employer.employerTitle,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)
        return applicationType === ApplicationType.HALF_OLD_AGE_PENSION
      },
      children: [
        buildSubSection({
          id: 'employment.status.section',
          title: oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
          children: [
            buildRadioField({
              id: 'employment.status',
              title:
                oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
              description:
                oldAgePensionFormMessage.employer
                  .selfEmployedOrEmployeeDescription,
              options: [
                {
                  value: Employment.SELFEMPLOYED,
                  label: oldAgePensionFormMessage.employer.selfEmployed,
                },
                {
                  value: Employment.EMPLOYEE,
                  label: oldAgePensionFormMessage.employer.employee,
                },
              ],
              width: 'half',
              defaultValue: Employment.EMPLOYEE,
              largeButtons: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'employment.selfEmployedAttachment.section',
          title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
          condition: (answers) => {
            const { employmentStatus } = getApplicationAnswers(answers)

            return employmentStatus === Employment.SELFEMPLOYED
          },
          children: [
            buildFileUploadField({
              id: 'employment.selfEmployedAttachment',
              title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
              description:
                oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
              condition: (answers) => {
                const { employmentStatus } = getApplicationAnswers(answers)

                return employmentStatus === Employment.SELFEMPLOYED
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'employerRegistration',
          title: oldAgePensionFormMessage.employer.registrationTitle,
          condition: (answers) => {
            const { employmentStatus } = getApplicationAnswers(answers)

            return employmentStatus === Employment.EMPLOYEE
          },
          children: [
            buildRepeater({
              id: 'employers',
              title: oldAgePensionFormMessage.employer.employerTitle,
              component: 'EmployersOverview',
              children: [
                buildMultiField({
                  id: 'addEmployers',
                  title: oldAgePensionFormMessage.employer.registrationTitle,
                  isPartOfRepeater: true,
                  children: [
                    buildTextField({
                      id: 'email',
                      variant: 'email',
                      title: oldAgePensionFormMessage.employer.email,
                    }),
                    buildTextField({
                      id: 'phoneNumber',
                      variant: 'tel',
                      format: '###-####',
                      placeholder: '000-0000',
                      title: oldAgePensionFormMessage.employer.phoneNumber,
                    }),
                    buildRadioField({
                      id: 'ratioType',
                      title: '',
                      width: 'half',
                      space: 3,
                      required: true,
                      options: [
                        {
                          value: RatioType.YEARLY,
                          label: oldAgePensionFormMessage.employer.ratioYearly,
                        },
                        {
                          value: RatioType.MONTHLY,
                          label: oldAgePensionFormMessage.employer.ratioMonthly,
                        },
                      ],
                    }),
                    buildTextField({
                      id: 'ratioYearly',
                      description: '',
                      title: oldAgePensionFormMessage.employer.ratio,
                      suffix: '%',
                      condition: (answers) => {
                        const { rawEmployers } = getApplicationAnswers(answers)
                        const currentEmployer =
                          rawEmployers[rawEmployers.length - 1]

                        return currentEmployer?.ratioType === RatioType.YEARLY
                      },
                      placeholder: '1%',
                      variant: 'number',
                      width: 'full',
                    }),
                    buildCustomField({
                      id: 'ratioMonthly',
                      title: '',
                      component: 'EmployersRatioMonthly',
                      condition: (answers) => {
                        const { rawEmployers } = getApplicationAnswers(answers)
                        const currentEmployer =
                          rawEmployers[rawEmployers.length - 1]

                        return currentEmployer?.ratioType === RatioType.MONTHLY
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'periodSection',
      title: oldAgePensionFormMessage.period.periodTitle,
      children: [
        // Period is from 65 year old birthday or last
        // 2 years if applicant is 67+ to 6 month ahead
        buildMultiField({
          id: 'periodField',
          title: oldAgePensionFormMessage.period.periodTitle,
          description: oldAgePensionFormMessage.period.periodDescription,
          children: [
            buildCustomField({
              id: 'period',
              component: 'Period',
              title: oldAgePensionFormMessage.period.periodTitle,
            }),
            buildAlertMessageField({
              id: 'period.alert',
              title: oldAgePensionFormMessage.shared.alertTitle,
              message: oldAgePensionFormMessage.period.periodAlertMessage,
              doesNotRequireAnswer: true,
              alertType: 'warning',
              links: [
                {
                  title: oldAgePensionFormMessage.period.periodAlertLinkTitle,
                  url: oldAgePensionFormMessage.period.periodAlertUrl,
                  isExternal: true,
                },
              ],
              condition: (answers, externalData) => {
                return isEarlyRetirement(answers, externalData)
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fileUpload',
      title: oldAgePensionFormMessage.fileUpload.title,
      children: [
        buildSubSection({
          condition: (answers, externalData) => {
            const earlyRetirement = isEarlyRetirement(answers, externalData)
            return earlyRetirement
          },
          id: 'fileUpload.earlyRetirement.section',
          title: oldAgePensionFormMessage.fileUpload.earlyRetirementTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.earlyRetirement',
              title: oldAgePensionFormMessage.fileUpload.earlyRetirementTitle,
              description:
                oldAgePensionFormMessage.fileUpload.earlyRetirementDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.earlyRetirementDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
              condition: (answers, externalData) => {
                return isEarlyRetirement(answers, externalData)
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUpload.pension.section',
          title: oldAgePensionFormMessage.fileUpload.pensionFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.pension',
              title: oldAgePensionFormMessage.fileUpload.pensionFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.pensionFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.pensionFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          condition: (answers) => {
            const { applicationType } = getApplicationAnswers(answers)
            return applicationType === ApplicationType.SAILOR_PENSION
          },
          id: 'fileUpload.fishermen.section',
          title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.fishermen',
              title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
              condition: (answers) => {
                const { applicationType } = getApplicationAnswers(answers)

                return applicationType === ApplicationType.SAILOR_PENSION
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: oldAgePensionFormMessage.comment.additionalInfoTitle,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.additionalFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: oldAgePensionFormMessage.comment.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: oldAgePensionFormMessage.comment.commentSection,
              variant: 'textarea',
              rows: 10,
              description: oldAgePensionFormMessage.comment.description,
              placeholder: oldAgePensionFormMessage.comment.placeholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: oldAgePensionFormMessage.review.confirmSectionTitle,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirm',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmScreen',
                    title: oldAgePensionFormMessage.review.confirmTitle,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: oldAgePensionFormMessage.review.confirmTitle,
                  actions: [
                    {
                      event: DefaultEvents.ABORT,
                      name: oldAgePensionFormMessage.review.cancelButton,
                      type: 'reject',
                      condition: (answers) => {
                        const { tempAnswers } = getApplicationAnswers(answers)
                        return !!tempAnswers
                      },
                    },
                    {
                      event: DefaultEvents.SUBMIT,
                      name: oldAgePensionFormMessage.review.confirmTitle,
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: oldAgePensionFormMessage.conclusionScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
