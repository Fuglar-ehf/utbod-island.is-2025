import {
  Application,
  buildAsyncSelectField,
  buildCustomField,
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'

import { parentalLeaveFormMessages } from '../lib/messages'
import {
  formatIsk,
  getEstimatedMonthlyPay,
  getOtherParentOptions,
} from '../parentalLeaveUtils'
import {
  GetPensionFunds,
  GetUnions,
  GetPrivatePensionFunds,
} from '../graphql/queries'
import { NO, YES } from '../constants'
import Logo from '../assets/Logo'
import { defaultMonths } from '../config'

interface SelectItem {
  id: string
  name: string
}

type UnionQuery = {
  getUnions: Array<SelectItem>
}

type PensionFundsQuery = {
  getPensionFunds: Array<SelectItem>
}

type PrivatePensionFundsQuery = {
  getPrivatePensionFunds: Array<SelectItem>
}

export const ParentalLeaveForm: Form = buildForm({
  id: 'ParentalLeaveDraft',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'theApplicant',
      title: parentalLeaveFormMessages.shared.applicantSection,
      children: [
        buildSubSection({
          id: 'externalData',
          title: parentalLeaveFormMessages.shared.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: parentalLeaveFormMessages.shared.introductionProvider,
              dataProviders: [
                buildDataProviderItem({
                  id: 'userProfile',
                  type: 'UserProfileProvider',
                  title:
                    parentalLeaveFormMessages.shared
                      .userProfileInformationTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared
                      .userProfileInformationSubTitle,
                }),
                buildDataProviderItem({
                  id: 'family',
                  type: 'FamilyInformationProvider',
                  title:
                    parentalLeaveFormMessages.shared.familyInformationTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared.familyInformationSubTitle,
                }),
                buildDataProviderItem({
                  id: 'pregnancyStatus',
                  type: 'PregnancyStatus',
                  title:
                    parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared
                      .expectedDateOfBirthSubtitle,
                }),
                buildDataProviderItem({
                  id: 'parentalLeaves',
                  type: 'ParentalLeaves',
                  title:
                    parentalLeaveFormMessages.shared
                      .existingParentalLeavesTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared
                      .existingParentalLeavesSubTitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'emailAndPhoneNumber',
          title: parentalLeaveFormMessages.applicant.subSection,
          children: [
            buildMultiField({
              id: 'contactInfo',
              title: parentalLeaveFormMessages.applicant.title,
              description: parentalLeaveFormMessages.applicant.description,
              children: [
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.email,
                  id: 'applicant.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      email?: string
                    })?.email,
                }),
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.phoneNumber,
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    })?.mobilePhoneNumber,
                  id: 'applicant.phoneNumber',
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParent',
          title: parentalLeaveFormMessages.shared.otherParentSubSection,
          children: [
            buildMultiField({
              id: 'otherParent',
              title: parentalLeaveFormMessages.shared.otherParentTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentDescription,
              condition: () => {
                // TODO this screen is only for the primary parent
                return true
              },
              children: [
                buildRadioField({
                  id: 'otherParent',
                  title: 'Other parent',
                  options: (application) => getOtherParentOptions(application),
                  largeButtons: true,
                }),
                buildTextField({
                  id: 'otherParentName',
                  condition: (answers) => answers.otherParent === 'manual',
                  title: parentalLeaveFormMessages.shared.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParentId',
                  condition: (answers) => answers.otherParent === 'manual',
                  title: parentalLeaveFormMessages.shared.otherParentID,
                  width: 'half',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
            buildRadioField({
              id: 'otherParentRightOfAccess',
              largeButtons: true,
              emphasize: true,
              condition: (answers) => answers.otherParent === 'manual',
              title: parentalLeaveFormMessages.rightOfAccess.title,
              description: parentalLeaveFormMessages.rightOfAccess.description,
              options: [
                {
                  label: parentalLeaveFormMessages.rightOfAccess.yesOption,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                  value: NO,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payments',
          title: parentalLeaveFormMessages.shared.paymentInformationSubSection,
          children: [
            buildMultiField({
              title: parentalLeaveFormMessages.shared.paymentInformationName,
              id: 'payments',
              children: [
                buildTextField({
                  title:
                    parentalLeaveFormMessages.shared.paymentInformationBank,
                  id: 'payments.bank',
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                }),
                buildAsyncSelectField({
                  title: parentalLeaveFormMessages.shared.pensionFund,
                  id: 'payments.pensionFund',
                  width: 'half',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<
                      PensionFundsQuery
                    >({
                      query: GetPensionFunds,
                    })

                    return (
                      data?.getPensionFunds.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildAsyncSelectField({
                  title: parentalLeaveFormMessages.shared.union,
                  id: 'payments.union',
                  width: 'half',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<UnionQuery>({
                      query: GetUnions,
                    })

                    return (
                      data?.getUnions.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  emphasize: true,
                  largeButtons: false,
                  id: 'usePrivatePensionFund',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  description:
                    parentalLeaveFormMessages.shared
                      .privatePensionFundDescription,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                }),
                buildAsyncSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFund',
                  title: parentalLeaveFormMessages.shared.privatePensionFund,
                  width: 'half',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<
                      PrivatePensionFundsQuery
                    >({
                      query: GetPrivatePensionFunds,
                    })

                    return (
                      data?.getPrivatePensionFunds.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFundPercentage',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundRatio,
                  width: 'half',
                  options: [
                    { label: '2%', value: '2' },
                    { label: '4%', value: '4' },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'personalAllowanceSubSection',
          title: parentalLeaveFormMessages.personalAllowance.title,
          children: [
            buildRadioField({
              id: 'usePersonalAllowance',
              title: parentalLeaveFormMessages.personalAllowance.useYours,
              largeButtons: true,
              width: 'half',
              options: [
                {
                  label: parentalLeaveFormMessages.shared.yesOptionLabel,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                  value: NO,
                },
              ],
            }),
            buildMultiField({
              id: 'personalAllowance',
              condition: (answers) => answers.usePersonalAllowance === YES,
              title: parentalLeaveFormMessages.personalAllowance.title,
              description:
                parentalLeaveFormMessages.personalAllowance.description,
              children: [
                buildRadioField({
                  id: 'personalAllowance.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
                  width: 'half',
                  largeButtons: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                }),
                buildTextField({
                  id: 'personalAllowance.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.zeroToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) =>
                    (answers as {
                      personalAllowance: { useAsMuchAsPossible: string }
                    })?.personalAllowance?.useAsMuchAsPossible === NO,
                  placeholder: '0%',
                  variant: 'number',
                  width: 'half',
                }),
              ],
            }),
            buildRadioField({
              id: 'usePersonalAllowanceFromSpouse',
              title: parentalLeaveFormMessages.personalAllowance.useFromSpouse,
              condition: (answers) => {
                // TODO add check if this person has a spouse...
                return true
              },
              largeButtons: true,
              width: 'half',
              options: [
                {
                  label: parentalLeaveFormMessages.shared.yesOptionLabel,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                  value: NO,
                },
              ],
            }),
            buildMultiField({
              id: 'personalAllowanceFromSpouse',
              condition: (answers) =>
                answers.usePersonalAllowanceFromSpouse === YES,
              title: parentalLeaveFormMessages.personalAllowance.spouseTitle,
              description:
                parentalLeaveFormMessages.personalAllowance.spouseDescription,
              children: [
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
                  width: 'half',
                  largeButtons: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                }),
                buildTextField({
                  id: 'personalAllowanceFromSpouse.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.zeroToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) =>
                    (answers as {
                      personalAllowanceFromSpouse: {
                        useAsMuchAsPossible: string
                      }
                    })?.personalAllowanceFromSpouse?.useAsMuchAsPossible === NO,
                  placeholder: '0%',
                  variant: 'number',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'employer',
          title: parentalLeaveFormMessages.employer.subSection,
          children: [
            buildRadioField({
              id: 'employer.isSelfEmployed',
              title: parentalLeaveFormMessages.selfEmployed.title,
              description: parentalLeaveFormMessages.selfEmployed.description,
              largeButtons: true,
              width: 'half',
              options: [
                {
                  label: parentalLeaveFormMessages.shared.yesOptionLabel,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                  value: NO,
                },
              ],
            }),
            buildMultiField({
              id: 'employer.information',
              title: parentalLeaveFormMessages.employer.title,
              description: parentalLeaveFormMessages.employer.description,
              condition: (answers) =>
                (answers as {
                  employer: {
                    isSelfEmployed: string
                  }
                })?.employer?.isSelfEmployed !== YES,
              children: [
                buildTextField({
                  title: parentalLeaveFormMessages.employer.email,
                  width: 'full',
                  id: 'employer.email',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'rights',
      title: parentalLeaveFormMessages.shared.rightsSection,
      children: [
        buildSubSection({
          id: 'rightsQuestions',
          title: parentalLeaveFormMessages.shared.yourRights,
          children: [
            buildMultiField({
              id: 'rightsIntro',
              title: parentalLeaveFormMessages.shared.theseAreYourRights,
              description: parentalLeaveFormMessages.shared.rightsDescription,
              children: [
                buildCustomField(
                  {
                    id: 'rightsIntro',
                    title: '',
                    component: 'BoxChart',
                  },
                  {
                    boxes: defaultMonths,
                    application: {},
                    calculateBoxStyle: () => 'blue',
                    keys: [
                      {
                        label: () => ({
                          ...parentalLeaveFormMessages.shared
                            .yourRightsInMonths,
                          values: { months: defaultMonths },
                        }),
                        bulletStyle: 'blue',
                      },
                    ],
                  },
                ),
              ],
            }),
            buildMultiField({
              id: 'requestRights.isRequestingRights',
              title: parentalLeaveFormMessages.shared.requestRightsName,
              description:
                parentalLeaveFormMessages.shared.requestRightsDescription,
              children: [
                buildCustomField({
                  id: 'requestRights.isRequestingRights',
                  title: '',
                  component: 'RequestRights',
                }),
                buildCustomField({
                  id: 'requestRights.requestDays',
                  title: '',
                  condition: (answers) =>
                    (answers as {
                      requestRights: {
                        isRequestingRights: string
                      }
                    })?.requestRights?.isRequestingRights === YES,
                  component: 'RequestDaysSlider',
                }),
              ],
            }),
            buildMultiField({
              id: 'giveRights.isGivingRights',
              title: parentalLeaveFormMessages.shared.giveRightsName,
              description:
                parentalLeaveFormMessages.shared.giveRightsDescription,
              condition: (answers) =>
                (answers as {
                  requestRights: {
                    isRequestingRights: string
                  }
                })?.requestRights?.isRequestingRights === NO,

              children: [
                buildCustomField({
                  id: 'giveRights.isGivingRights',
                  title: '',
                  component: 'GiveRights',
                }),
                buildCustomField({
                  id: 'giveRights.giveDays',
                  title: '',
                  condition: (answers) =>
                    (answers as {
                      giveRights: {
                        isGivingRights: string
                      }
                    })?.giveRights?.isGivingRights === YES,
                  component: 'GiveDaysSlider',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'rightsReview',
          title: parentalLeaveFormMessages.shared.rightsSummarySubSection,
          children: [
            buildMultiField({
              id: 'reviewRights',
              title: parentalLeaveFormMessages.shared.rightsSummaryName,
              description: (application) =>
                `${formatIsk(
                  getEstimatedMonthlyPay(application),
                )} er áætluð mánaðarleg útborgun þín fyrir hvern heilan mánuð eftir skatt.`, // TODO messages
              children: [
                buildCustomField({
                  id: 'reviewRights',
                  title: '',
                  component: 'ReviewRights',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'leavePeriods',
      title: parentalLeaveFormMessages.shared.periodsSection,
      children: [
        buildCustomField({
          id: 'periodsImageScreen',
          title: parentalLeaveFormMessages.shared.periodsImageTitle,
          component: 'PeriodsSectionImage',
        }),
        buildSubSection({
          id: 'firstPeriod',
          title: parentalLeaveFormMessages.shared.firstPeriodName,
          children: [
            buildRadioField({
              id: 'singlePeriod',
              title: parentalLeaveFormMessages.shared.periodAllAtOnce,
              description:
                parentalLeaveFormMessages.shared.periodAllAtOnceDescription,
              largeButtons: true,
              options: [
                {
                  label: parentalLeaveFormMessages.shared.periodAllAtOnceYes,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.periodAllAtOnceNo,
                  value: NO,
                },
              ],
            }),
            buildCustomField({
              id: 'firstPeriodStart',
              title: parentalLeaveFormMessages.firstPeriodStart.title,
              component: 'FirstPeriodStart',
            }),
            buildMultiField({
              id: 'startDate',
              condition: (formValue) =>
                formValue.firstPeriodStart === 'specificDate',
              title: parentalLeaveFormMessages.startDate.title,
              description: parentalLeaveFormMessages.startDate.description,
              children: [
                buildDateField({
                  id: 'periods[0].startDate',
                  width: 'half',
                  title: parentalLeaveFormMessages.startDate.label,
                  placeholder: parentalLeaveFormMessages.startDate.placeholder,
                }),
              ],
            }),
            buildRadioField({
              id: 'confirmLeaveDuration',
              title: parentalLeaveFormMessages.duration.title,
              description: parentalLeaveFormMessages.duration.description,
              largeButtons: true,
              options: [
                {
                  label: parentalLeaveFormMessages.duration.monthsOption,
                  value: 'duration',
                },
                {
                  label: parentalLeaveFormMessages.duration.specificDateOption,
                  value: 'specificDate',
                },
              ],
            }),
            buildMultiField({
              id: 'endDate',
              condition: (formValue) =>
                formValue.confirmLeaveDuration === 'specificDate',
              title: parentalLeaveFormMessages.endDate.title,
              description: parentalLeaveFormMessages.endDate.description,
              children: [
                buildDateField({
                  id: 'periods[0].endDate',
                  width: 'half',
                  title: parentalLeaveFormMessages.endDate.label,
                  placeholder: parentalLeaveFormMessages.endDate.placeholder,
                }),
              ],
            }),
            buildCustomField(
              {
                id: 'periods[0].endDate',
                condition: (formValue) =>
                  formValue.confirmLeaveDuration === 'duration',
                title: parentalLeaveFormMessages.duration.title,
                component: 'Duration',
              },
              {},
            ),
            buildMultiField({
              id: 'periods[0].ratio',
              title: parentalLeaveFormMessages.ratio.title,
              description: parentalLeaveFormMessages.ratio.description,
              children: [
                buildSelectField({
                  id: 'periods[0].ratio',
                  width: 'half',
                  title: parentalLeaveFormMessages.ratio.label,
                  placeholder: parentalLeaveFormMessages.ratio.placeholder,
                  defaultValue: '100',
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'addMorePeriods',
          title: parentalLeaveFormMessages.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              title: parentalLeaveFormMessages.leavePlan.title,
              component: 'PeriodsRepeater',
              children: [
                buildDateField({
                  id: 'startDate',
                  title: parentalLeaveFormMessages.startDate.title,
                  description: parentalLeaveFormMessages.startDate.description,
                  placeholder: parentalLeaveFormMessages.startDate.placeholder,
                }),
                buildMultiField({
                  id: 'endDate',
                  title: parentalLeaveFormMessages.endDate.title,
                  description: parentalLeaveFormMessages.endDate.description,
                  children: [
                    buildDateField({
                      id: 'endDate',
                      title: parentalLeaveFormMessages.endDate.label,
                      placeholder:
                        parentalLeaveFormMessages.endDate.placeholder,
                    }),
                  ],
                }),
                // buildCustomField(
                //   {
                //     id: 'endDate',
                //     name: parentalLeaveFormMessages.shared.duration,
                //     description: parentalLeaveFormMessages.duration.description,
                //     component: 'Duration',
                //   },
                //   {
                //     showTimeline: true,
                //   },
                // ),
                buildMultiField({
                  id: 'ratio',
                  title: parentalLeaveFormMessages.ratio.title,
                  description: parentalLeaveFormMessages.ratio.description,
                  children: [
                    buildSelectField({
                      id: 'ratio',
                      width: 'half',
                      title: parentalLeaveFormMessages.ratio.label,
                      defaultValue: '100',
                      placeholder: parentalLeaveFormMessages.ratio.placeholder,
                      options: [
                        { label: '100%', value: '100' },
                        { label: '75%', value: '75' },
                        { label: '50%', value: '50' },
                        { label: '25%', value: '25' },
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'paymentPlan',
          title: parentalLeaveFormMessages.paymentPlan.subSection,
          children: [
            buildCustomField(
              {
                id: 'paymentPlan',
                title: parentalLeaveFormMessages.paymentPlan.title,
                description: parentalLeaveFormMessages.paymentPlan.description,
                component: 'PaymentSchedule',
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'shareInformation',
          title: parentalLeaveFormMessages.shareInformation.subSection,
          condition: (answers) => answers.otherParent !== NO,
          children: [
            buildRadioField({
              id: 'shareInformationWithOtherParent',
              title: parentalLeaveFormMessages.shareInformation.title,
              description:
                parentalLeaveFormMessages.shareInformation.description,
              emphasize: false,
              largeButtons: true,
              options: [
                {
                  label: parentalLeaveFormMessages.shareInformation.yesOption,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shareInformation.noOption,
                  value: NO,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.section,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: parentalLeaveFormMessages.confirmation.title,
          description: parentalLeaveFormMessages.confirmation.description,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: '',
              component: 'Review',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: parentalLeaveFormMessages.confirmation.title,
              actions: [
                {
                  event: 'SUBMIT',
                  name: parentalLeaveFormMessages.confirmation.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: parentalLeaveFormMessages.finalScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
