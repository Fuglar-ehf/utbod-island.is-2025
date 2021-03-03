import {
  buildCustomField,
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildFileUploadField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  Comparators,
  Application,
  FormValue,
  ExternalData,
  buildAsyncSelectField,
} from '@island.is/application/core'
import { m } from './messages'
import { YES, NO, FILE_SIZE_LIMIT, StatusTypes } from '../constants'
import { CountryDataResult } from '../types'
import { Address } from '@island.is/api/schema'
import Logo from '../assets/Logo'
import {
  requireConfirmationOfResidency,
  requireWaitingPeriod,
  shouldShowModal,
} from '../healthInsuranceUtils'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.applicantInfoSection,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          subTitle: ' ',
          checkboxLabel: m.externalDataCheckbox,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'directorateOfLabor',
              type: undefined,
              title: m.directorateOfLaborTitle,
              subTitle: m.directorateOfLaborSubTitle,
            }),
            buildDataProviderItem({
              id: 'internalRevenue',
              type: undefined,
              title: m.internalRevenueTitle,
              subTitle: m.internalRevenueSubTitle,
            }),
            buildDataProviderItem({
              id: 'insuranceAdministration',
              type: undefined,
              title: m.socialInsuranceAdministrationTitle,
              subTitle: m.socialInsuranceAdministrationSubtitle,
            }),
            buildDataProviderItem({
              id: 'moreInfo',
              type: undefined,
              title: '',
              subTitle: m.dataProvidersMoreInfo,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'applications',
              type: 'ApplicationsProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'healthInsurance',
              type: 'HealthInsuranceProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'pendingApplications',
              type: 'PendingApplications',
              title: '',
              subTitle: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'informationRetrieval',
          title: m.externalDataTitle,
          children: [
            buildCustomField({
              id: 'informationRetrieval',
              component: 'InformationRetrieval',
              title: '',
            }),
            buildCustomField({
              id: 'errorModal',
              component: 'ErrorModal',
              title: '',
            }),
          ],
          condition: (formValue: FormValue, externalData: ExternalData) => {
            return shouldShowModal(externalData)
          },
        }),
        buildMultiField({
          id: 'contactInfoSection',
          title: m.contactInfoTitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  fullName?: string
                })?.fullName,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  nationalId?: string
                })?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  address?: Address
                }).address?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: m.postalCode,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  address?: Address
                }).address?.postalCode,
            }),
            buildTextField({
              id: 'applicant.city',
              title: m.city,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  address?: Address
                }).address?.city,
            }),
            buildCustomField({
              id: 'applicant.citizenship',
              title: '',
              component: 'CitizenshipField',
            }),
            buildDescriptionField({
              id: 'editNationalRegistryData',
              title: '',
              description: m.editNationalRegistryData,
            }),
            buildDividerField({ title: ' ', color: 'transparent' }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              variant: 'email',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                })?.mobilePhoneNumber,
            }),
            buildDescriptionField({
              id: 'editDigitalIslandData',
              title: '',
              description: m.editDigitalIslandData,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'statusAndChildrenSection',
      title: m.statusAndChildren,
      children: [
        buildMultiField({
          id: 'statusAndChildren',
          title: m.statusAndChildren,
          children: [
            buildRadioField({
              id: 'status.type',
              title: '',
              description: m.statusDescription,
              width: 'half',
              largeButtons: true,
              options: [
                {
                  label: m.statusEmployed,
                  value: StatusTypes.EMPLOYED,
                  tooltip: m.statusEmployedInformation,
                },
                {
                  label: m.statusStudent,
                  value: StatusTypes.STUDENT,
                  tooltip: m.statusStudentInformation,
                },
                {
                  label: m.statusPensioner,
                  value: StatusTypes.PENSIONER,
                  tooltip: m.statusPensionerInformation,
                },
                {
                  label: m.statusOther,
                  value: StatusTypes.OTHER,
                  tooltip: m.statusOtherInformation,
                },
              ],
            }),
            buildCustomField({
              id: 'confirmationOfStudiesDescription',
              title: m.confirmationOfStudies,
              description: m.confirmationOfStudiesTooltip,
              component: 'TextWithTooltip',
              condition: (answers) =>
                (answers.status as { type: string })?.type ===
                StatusTypes.STUDENT,
            }),
            buildFileUploadField({
              id: 'status.confirmationOfStudies',
              title: '',
              introduction: '',
              maxSize: FILE_SIZE_LIMIT,
              uploadHeader: m.fileUploadHeader,
              uploadDescription: m.fileUploadDescription,
              uploadButtonLabel: m.fileUploadButton,
              condition: (answers) =>
                (answers.status as { type: string })?.type ===
                StatusTypes.STUDENT,
            }),
            buildRadioField({
              id: 'children',
              title: '',
              description: m.childrenDescription,
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildCustomField({
              id: 'childrenInfo',
              title: '',
              component: 'ChildrenInfoMessage',
              condition: (answers) => answers.children === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'formerInsuranceSection',
      title: m.formerInsuranceSection,
      children: [
        buildMultiField({
          id: 'formerInsurance',
          title: m.formerInsuranceTitle,
          children: [
            buildRadioField({
              id: 'formerInsurance.registration',
              title: '',
              description: m.formerInsuranceRegistration,
              largeButtons: true,
              options: [
                { label: m.formerInsuranceNoOption, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildAsyncSelectField({
              id: 'formerInsurance.country',
              title: m.formerInsuranceCountry,
              placeholder: m.formerInsuranceCountryPlaceholder,
              loadingError: m.formerInsuranceCountryError,
              loadOptions: async () => {
                const countries = await fetch(
                  'https://restcountries.eu/rest/v2/all',
                )
                const data = (await countries.json()) as CountryDataResult[]
                return data.map(
                  ({ name, alpha2Code: countryCode, regionalBlocs }) => {
                    const regions = regionalBlocs.map((blocs) => blocs.acronym)
                    const option = { name, countryCode, regions }
                    return {
                      label: name,
                      value: JSON.stringify(option),
                    }
                  },
                )
              },
            }),
            buildTextField({
              id: 'formerInsurance.personalId',
              title: m.formerPersonalId,
              width: 'half',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'formerInsurance.institution',
              title: m.formerInsuranceInstitution,
              width: 'half',
              backgroundColor: 'blue',
            }),
            buildCustomField({
              id: 'waitingPeriodInfo',
              title: '',
              component: 'FormerCountryErrorMessage',
              condition: (answers: FormValue) => {
                const formerCountry = (answers as {
                  formerInsurance: { country: string }
                })?.formerInsurance?.country
                const citizenship = (answers as {
                  applicant: { citizenship: string }
                })?.applicant?.citizenship
                return (
                  !!formerCountry &&
                  requireWaitingPeriod(formerCountry, citizenship)
                )
              },
            }),
            buildFileUploadField({
              id: 'formerInsurance.confirmationOfResidencyDocument',
              title: '',
              maxSize: FILE_SIZE_LIMIT,
              introduction: m.confirmationOfResidencyFileUpload,
              uploadHeader: m.fileUploadHeader,
              uploadDescription: m.fileUploadDescription,
              uploadButtonLabel: m.fileUploadButton,
              condition: (answers: FormValue) => {
                const formerCountry = (answers as {
                  formerInsurance: { country: string }
                })?.formerInsurance?.country
                return requireConfirmationOfResidency(formerCountry)
              },
            }),
            buildCustomField({
              id: 'formerInsurance.entitlementDescription',
              title: m.formerInsuranceEntitlement,
              description: m.formerInsuranceEntitlementTooltip,
              component: 'TextWithTooltip',
              condition: (answers: FormValue) => {
                const formerCountry = (answers as {
                  formerInsurance: { country: string }
                })?.formerInsurance?.country
                const citizenship = (answers as {
                  applicant: { citizenship: string }
                })?.applicant?.citizenship
                return !requireWaitingPeriod(formerCountry, citizenship)
              },
            }),
            buildRadioField({
              id: 'formerInsurance.entitlement',
              title: '',
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
              condition: (answers: FormValue) => {
                const formerCountry = (answers as {
                  formerInsurance: { country: string }
                })?.formerInsurance?.country
                const citizenship = (answers as {
                  applicant: { citizenship: string }
                })?.applicant?.citizenship
                return !requireWaitingPeriod(formerCountry, citizenship)
              },
            }),
            buildTextField({
              id: 'formerInsurance.entitlementReason',
              title: m.formerInsuranceAdditionalInformation,
              placeholder: m.formerInsuranceAdditionalInformationPlaceholder,
              variant: 'textarea',
              backgroundColor: 'blue',
              condition: (answers: FormValue) => {
                const entitlement = (answers as {
                  formerInsurance: { entitlement: string }
                })?.formerInsurance?.entitlement
                const formerCountry = (answers as {
                  formerInsurance: { country: string }
                })?.formerInsurance?.country
                const citizenship = (answers as {
                  applicant: { citizenship: string }
                })?.applicant?.citizenship
                return (
                  entitlement === YES &&
                  !requireWaitingPeriod(formerCountry, citizenship)
                )
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: m.confirmationSection,
      children: [
        buildMultiField({
          id: '',
          title: m.confirmationTitle,
          children: [
            buildCustomField({
              id: 'review',
              title: '',
              component: 'Review',
            }),
            buildRadioField({
              id: 'hasAdditionalInfo',
              title: '',
              description: m.additionalInfo,
              largeButtons: true,
              width: 'half',
              options: [
                { value: NO, label: m.noOptionLabel },
                { value: YES, label: m.yesOptionLabel },
              ],
            }),
            buildTextField({
              id: 'additionalRemarks',
              title: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlaceholder,
              backgroundColor: 'blue',
              condition: {
                questionId: 'hasAdditionalInfo',
                comparator: Comparators.GTE,
                value: YES,
              },
            }),
            buildFileUploadField({
              id: 'additionalFiles',
              title: '',
              introduction: '',
              maxSize: FILE_SIZE_LIMIT,
              uploadHeader: m.fileUploadHeader,
              uploadDescription: m.fileUploadDescription,
              uploadButtonLabel: m.fileUploadButton,
              condition: {
                questionId: 'hasAdditionalInfo',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildCustomField({
              id: 'confirmCorrectInfo',
              title: '',
              component: 'ConfirmCheckbox',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.submitLabel,
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: m.submitLabel, type: 'primary' },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'successfulSubmission',
          title: '',
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
