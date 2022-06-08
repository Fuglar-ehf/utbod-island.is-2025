import addDays from 'date-fns/addDays'

import {
  Application,
  buildAsyncSelectField,
  buildCustomField,
  buildDateField,
  buildFileUploadField,
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
  NO_ANSWER,
} from '@island.is/application/core'

import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getExpectedDateOfBirth,
  getAllPeriodDates,
  getSelectedChild,
  requiresOtherParentApproval,
  getApplicationAnswers,
  allowOtherParent,
  getLastValidPeriodEndDate,
} from '../lib/parentalLeaveUtils'
import {
  GetPensionFunds,
  GetUnions,
  GetPrivatePensionFunds,
} from '../graphql/queries'
import {
  FILE_SIZE_LIMIT,
  MANUAL,
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  ParentalRelations,
  StartDateOptions,
  YES,
} from '../constants'
import Logo from '../assets/Logo'
import {
  defaultMonths,
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minPeriodDays,
} from '../config'
import {
  GetPensionFundsQuery,
  GetPrivatePensionFundsQuery,
  GetUnionsQuery,
} from '../types/schema'

export const ParentalLeaveForm: Form = buildForm({
  id: 'ParentalLeaveDraft',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'prerequisites',
      title: parentalLeaveFormMessages.shared.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'theApplicant',
      title: parentalLeaveFormMessages.shared.applicantSection,
      children: [
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
          condition: (answers, externalData) => {
            const selectedChild = getSelectedChild(answers, externalData)

            if (selectedChild !== null) {
              return (
                selectedChild.parentalRelation === ParentalRelations.primary
              )
            }

            return true
          },
          children: [
            buildMultiField({
              id: 'otherParent',
              title: parentalLeaveFormMessages.shared.otherParentTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentDescription,
              children: [
                buildCustomField({
                  component: 'OtherParent',
                  id: 'otherParent.chooseOtherParent',
                  title: parentalLeaveFormMessages.shared.otherParentSubTitle,
                }),
                buildTextField({
                  id: 'otherParent.otherParentName',
                  condition: (answers) =>
                    (answers as {
                      otherParent: {
                        chooseOtherParent: string
                      }
                    })?.otherParent?.chooseOtherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParent.otherParentId',
                  condition: (answers) =>
                    (answers as {
                      otherParent: {
                        chooseOtherParent: string
                      }
                    })?.otherParent?.chooseOtherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentID,
                  width: 'half',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
            buildRadioField({
              id: 'otherParentRightOfAccess',
              condition: (answers) =>
                (answers as {
                  otherParent: {
                    chooseOtherParent: string
                  }
                })?.otherParent?.chooseOtherParent === MANUAL,
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
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  placeholder:
                    parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
                  loadOptions: async ({ apolloClient }) => {
                    const {
                      data,
                    } = await apolloClient.query<GetPensionFundsQuery>({
                      query: GetPensionFunds,
                    })

                    return (
                      data?.getPensionFunds?.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildCustomField({
                  component: 'UseUnion',
                  id: 'useUnion',
                  title: parentalLeaveFormMessages.shared.unionName,
                  description:
                    parentalLeaveFormMessages.shared.unionDescription,
                }),
                buildAsyncSelectField({
                  condition: (answers) => answers.useUnion === YES,
                  title: parentalLeaveFormMessages.shared.union,
                  id: 'payments.union',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  placeholder:
                    parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<GetUnionsQuery>({
                      query: GetUnions,
                    })

                    return (
                      data?.getUnions
                        ?.filter(({ id }) => id !== NO_UNION)
                        .map(({ id, name }) => ({
                          label: name,
                          value: id,
                        })) ?? []
                    )
                  },
                }),
                buildCustomField({
                  component: 'UsePrivatePensionFund',
                  id: 'usePrivatePensionFund',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  description:
                    parentalLeaveFormMessages.shared
                      .privatePensionFundDescription,
                }),
                buildAsyncSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFund',
                  title: parentalLeaveFormMessages.shared.privatePensionFund,
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  loadOptions: async ({ apolloClient }) => {
                    const {
                      data,
                    } = await apolloClient.query<GetPrivatePensionFundsQuery>({
                      query: GetPrivatePensionFunds,
                    })

                    return (
                      data?.getPrivatePensionFunds
                        ?.filter(({ id }) => id !== NO_PRIVATE_PENSION_FUND)
                        .map(({ id, name }) => ({
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
                buildCustomField({
                  component: 'PersonalUseAsMuchAsPossible',
                  id: 'personalAllowance.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
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
              condition: (answers, externalData) => {
                const selectedChild = getSelectedChild(answers, externalData)

                return (
                  selectedChild?.parentalRelation ===
                    ParentalRelations.primary && allowOtherParent(answers)
                )
              },
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
                answers.usePersonalAllowanceFromSpouse === YES &&
                allowOtherParent(answers),
              title: parentalLeaveFormMessages.personalAllowance.spouseTitle,
              description:
                parentalLeaveFormMessages.personalAllowance.spouseDescription,
              children: [
                buildCustomField({
                  component: 'SpouseUseAsMuchAsPossible',
                  id: 'personalAllowanceFromSpouse.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossibleFromSpouse,
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
            buildCustomField({
              component: 'SelfEmployed',
              id: 'employer.isSelfEmployed',
              title: parentalLeaveFormMessages.selfEmployed.title,
              description: parentalLeaveFormMessages.selfEmployed.description,
            }),
            buildMultiField({
              id: 'employer.selfEmployed.attachment',
              title: parentalLeaveFormMessages.selfEmployed.attachmentTitle,
              description:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              condition: (answers) =>
                (answers as {
                  employer: {
                    isSelfEmployed: string
                  }
                })?.employer?.isSelfEmployed === YES,
              children: [
                buildFileUploadField({
                  id: 'employer.selfEmployed.file',
                  title: '',
                  introduction: '',
                  maxSize: FILE_SIZE_LIMIT,
                  uploadAccept: '.pdf',
                  uploadHeader: '',
                  uploadDescription: '',
                  uploadButtonLabel:
                    parentalLeaveFormMessages.selfEmployed.attachmentButton,
                }),
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
                buildTextField({
                  title: parentalLeaveFormMessages.employer.phoneNumber,
                  width: 'full',
                  id: 'employerPhoneNumber',
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
      condition: (answers, externalData) => {
        const selectedChild = getSelectedChild(answers, externalData)

        return selectedChild?.parentalRelation === ParentalRelations.primary
      },
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
                    doesNotRequireAnswer: true,
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
            buildCustomField({
              id: 'transferRights',
              childInputIds: [
                'transferRights',
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary && allowOtherParent(answers)

                return canTransferRights
              },
              title: parentalLeaveFormMessages.shared.transferRightsTitle,
              description:
                parentalLeaveFormMessages.shared.transferRightsDescription,
              component: 'TransferRights',
            }),
            buildCustomField({
              id: 'requestRights.requestDays',
              childInputIds: [
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
              ],
              title:
                parentalLeaveFormMessages.shared.transferRightsRequestTitle,
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary && allowOtherParent(answers)

                return (
                  canTransferRights &&
                  getApplicationAnswers(answers).isRequestingRights === YES
                )
              },
              component: 'RequestDaysSlider',
            }),
            buildCustomField({
              id: 'giveRights.giveDays',
              childInputIds: [
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              title: parentalLeaveFormMessages.shared.transferRightsGiveTitle,
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary && allowOtherParent(answers)

                return (
                  canTransferRights &&
                  getApplicationAnswers(answers).isGivingRights === YES
                )
              },
              component: 'GiveDaysSlider',
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParentEmailQuestion',
          title: parentalLeaveFormMessages.shared.otherParentEmailSubSection,
          condition: (answers, externalData) =>
            requiresOtherParentApproval(answers, externalData),
          children: [
            buildTextField({
              id: 'otherParentEmail',
              title: parentalLeaveFormMessages.shared.otherParentEmailTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentEmailDescription,
            }),
          ],
        }),
        /*
        TODO: add back once payment plan is implemented
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
        */
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
          doesNotRequireAnswer: true,
        }),
        buildSubSection({
          id: 'addPeriods',
          title: parentalLeaveFormMessages.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              title: parentalLeaveFormMessages.leavePlan.title,
              component: 'PeriodsRepeater',
              children: [
                buildCustomField({
                  id: 'firstPeriodStart',
                  title: parentalLeaveFormMessages.firstPeriodStart.title,
                  condition: (answers) => {
                    const { periods } = getApplicationAnswers(answers)

                    return periods.length === 0
                  },
                  component: 'FirstPeriodStart',
                }),
                buildDateField({
                  id: 'startDate',
                  title: parentalLeaveFormMessages.startDate.title,
                  description: parentalLeaveFormMessages.startDate.description,
                  placeholder: parentalLeaveFormMessages.startDate.placeholder,
                  defaultValue: NO_ANSWER,
                  condition: (answers) => {
                    const { periods, rawPeriods } = getApplicationAnswers(
                      answers,
                    )
                    const currentPeriod = rawPeriods[rawPeriods.length - 1]
                    const firstPeriodRequestingSpecificStartDate =
                      currentPeriod?.firstPeriodStart ===
                      StartDateOptions.SPECIFIC_DATE

                    return (
                      firstPeriodRequestingSpecificStartDate ||
                      periods.length !== 0
                    )
                  },
                  minDate: (application: Application) => {
                    const expectedDateOfBirth = getExpectedDateOfBirth(
                      application,
                    )

                    const lastPeriodEndDate = getLastValidPeriodEndDate(
                      application,
                    )

                    if (lastPeriodEndDate) {
                      return lastPeriodEndDate
                    } else if (expectedDateOfBirth) {
                      return addDays(
                        new Date(expectedDateOfBirth),
                        -minimumPeriodStartBeforeExpectedDateOfBirth,
                      )
                    }

                    return new Date()
                  },
                  excludeDates: (application) => {
                    const { periods } = getApplicationAnswers(
                      application.answers,
                    )

                    return getAllPeriodDates(periods)
                  },
                }),
                buildRadioField({
                  id: 'useLength',
                  title: parentalLeaveFormMessages.duration.title,
                  description: parentalLeaveFormMessages.duration.description,
                  defaultValue: NO_ANSWER,
                  options: [
                    {
                      label: parentalLeaveFormMessages.duration.monthsOption,
                      value: YES,
                    },
                    {
                      label:
                        parentalLeaveFormMessages.duration.specificDateOption,
                      value: NO,
                    },
                  ],
                }),
                buildCustomField({
                  id: 'endDate',
                  condition: (answers) => {
                    const { rawPeriods } = getApplicationAnswers(answers)

                    return rawPeriods[rawPeriods.length - 1].useLength === YES
                  },
                  title: parentalLeaveFormMessages.duration.title,
                  component: 'Duration',
                }),
                buildCustomField(
                  {
                    id: 'endDate',
                    title: parentalLeaveFormMessages.endDate.title,
                    component: 'PeriodEndDate',
                    condition: (answers) => {
                      const { rawPeriods } = getApplicationAnswers(answers)

                      return rawPeriods[rawPeriods.length - 1].useLength === NO
                    },
                  },
                  {
                    minDate: (application: Application) => {
                      const { rawPeriods } = getApplicationAnswers(
                        application.answers,
                      )
                      const latestStartDate =
                        rawPeriods[rawPeriods.length - 1].startDate

                      return addDays(
                        new Date(latestStartDate),
                        minPeriodDays + 1,
                      )
                    },
                    excludeDates: (application: Application) => {
                      const { periods } = getApplicationAnswers(
                        application.answers,
                      )

                      return getAllPeriodDates(periods)
                    },
                  },
                ),
                buildCustomField({
                  id: 'ratio',
                  title: parentalLeaveFormMessages.ratio.title,
                  description: parentalLeaveFormMessages.ratio.description,
                  component: 'PeriodPercentage',
                }),
              ],
            }),
          ],
        }),
        // TODO: Bring back payment calculation info, once we have an api
        // app.asana.com/0/1182378413629561/1200214178491335/f
        // buildSubSection({
        //   id: 'paymentPlan',
        //   title: parentalLeaveFormMessages.paymentPlan.subSection,
        //   children: [
        //     buildCustomField(
        //       {
        //         id: 'paymentPlan',
        //         title: parentalLeaveFormMessages.paymentPlan.title,
        //         description: parentalLeaveFormMessages.paymentPlan.description,
        //         component: 'PaymentSchedule',
        //       },
        //       {},
        //     ),
        //   ],
        // }),

        // TODO: Bring back this feature post v1 launch
        // https://app.asana.com/0/1182378413629561/1200214178491339/f
        // buildSubSection({
        //   id: 'shareInformation',
        //   title: parentalLeaveFormMessages.shareInformation.subSection,
        //   condition: (answers) => answers.otherParent !== NO,
        //   children: [
        //     buildRadioField({
        //       id: 'shareInformationWithOtherParent',
        //       title: parentalLeaveFormMessages.shareInformation.title,
        //       description:
        //         parentalLeaveFormMessages.shareInformation.description,
        //       options: [
        //         {
        //           label: parentalLeaveFormMessages.shareInformation.yesOption,
        //           value: YES,
        //         },
        //         {
        //           label: parentalLeaveFormMessages.shareInformation.noOption,
        //           value: NO,
        //         },
        //       ],
        //     }),
        //   ],
        // }),
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
            buildCustomField(
              {
                id: 'confirmationScreen',
                title: '',
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
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
