import {
  buildAlertMessageField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  NO,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { ApplicationType } from '../lib/constants'
import { oldAgePensionFormMessage } from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getYesNOOptions,
} from '../lib/oldAgePensionUtils'
import {
  NationalRegistryResidenceHistoryApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'OldAgePensionPrerequisites',
  title: oldAgePensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.pre.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'applicationType',
          title: oldAgePensionFormMessage.pre.applicationTypeTitle,
          children: [
            buildRadioField({
              id: 'applicationType.option',
              title: oldAgePensionFormMessage.pre.applicationTypeTitle,
              description:
                oldAgePensionFormMessage.pre.applicationTypeDescription,
              options: [
                {
                  value: ApplicationType.OLD_AGE_PENSION,
                  label: oldAgePensionFormMessage.shared.applicationTitle,
                  subLabel:
                    oldAgePensionFormMessage.pre
                      .retirementPensionApplicationDescription,
                },
                // {
                //   value: ApplicationType.HALF_OLD_AGE_PENSION,
                //   label:
                //     oldAgePensionFormMessage.pre
                //       .halfRetirementPensionApplicationTitle,
                //   subLabel:
                //     oldAgePensionFormMessage.pre
                //       .halfRetirementPensionApplicationDescription,
                // },
                {
                  value: ApplicationType.SAILOR_PENSION,
                  label: oldAgePensionFormMessage.pre.fishermenApplicationTitle,
                  subLabel:
                    oldAgePensionFormMessage.pre
                      .fishermenApplicationDescription,
                },
              ],
              required: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: oldAgePensionFormMessage.pre.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: oldAgePensionFormMessage.pre.externalDataSubSection,
              subTitle: oldAgePensionFormMessage.pre.externalDataDescription,
              checkboxLabel: oldAgePensionFormMessage.pre.checkboxProvider,
              dataProviders: [
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: oldAgePensionFormMessage.pre.skraInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.pre.skraInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryResidenceHistoryApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: NationalRegistrySpouseApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: SocialInsuranceAdministrationApplicantApi,
                  title:
                    oldAgePensionFormMessage.pre
                      .socialInsuranceAdministrationInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.pre
                      .socialInsuranceAdministrationInformationDescription,
                }),
                buildDataProviderItem({
                  provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: SocialInsuranceAdministrationCurrenciesApi,
                  title: '',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'questions',
          title: oldAgePensionFormMessage.pre.questionTitle,
          condition: (_, externalData) => {
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is eligible
            return isEligible
          },
          children: [
            buildMultiField({
              id: 'questions',
              title: oldAgePensionFormMessage.pre.questionTitle,
              description:
                oldAgePensionFormMessage.pre.pensionFundQuestionDescription,
              children: [
                buildRadioField({
                  id: 'questions.pensionFund',
                  title: '',
                  options: getYesNOOptions(),
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'question.pensionFundAlert',
                  title: oldAgePensionFormMessage.shared.alertTitle,
                  message:
                    oldAgePensionFormMessage.pre.pensionFundAlertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'error',
                  condition: (answers) => {
                    const { pensionFundQuestion } =
                      getApplicationAnswers(answers)

                    return pensionFundQuestion === NO
                  },
                }),
                buildSubmitField({
                  id: 'toDraft',
                  title: oldAgePensionFormMessage.pre.confirmationTitle,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: oldAgePensionFormMessage.pre.startApplication,
                      type: 'primary',
                      condition: (answers) => {
                        const { pensionFundQuestion } =
                          getApplicationAnswers(answers)

                        return pensionFundQuestion !== NO
                      },
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'isNotEligible',
          title: oldAgePensionFormMessage.pre.isNotEligibleLabel,
          condition: (_, externalData) => {
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is not eligible
            return !isEligible
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              title: '',
              description:
                oldAgePensionFormMessage.pre.isNotEligibleDescription,
            }),
            // Empty submit field to hide all buttons in the footer
            buildSubmitField({
              id: '',
              title: '',
              actions: [],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicant',
      title: oldAgePensionFormMessage.applicant.applicantSection,
      children: [],
    }),
    buildSection({
      id: 'periodSection',
      title: oldAgePensionFormMessage.period.periodTitle,
      children: [],
    }),
    buildSection({
      id: 'fileUpload',
      title: oldAgePensionFormMessage.fileUpload.title,
      children: [],
    }),
    buildSection({
      id: 'additionalInformation',
      title: oldAgePensionFormMessage.comment.additionalInfoTitle,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: oldAgePensionFormMessage.review.overviewTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: oldAgePensionFormMessage.review.confirmSectionTitle,
      children: [],
    }),
  ],
})
