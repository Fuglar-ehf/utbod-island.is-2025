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
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { ApplicationType } from '../lib/constants'
import { oldAgePensionFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../lib/oldAgePensionUtils'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import {
  NationalRegistryResidenceHistoryApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'OldAgePensionPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
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
          title: socialInsuranceAdministrationMessage.pre.externalDataSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title:
                socialInsuranceAdministrationMessage.pre.externalDataSection,
              subTitle:
                socialInsuranceAdministrationMessage.pre
                  .externalDataDescription,
              checkboxLabel:
                socialInsuranceAdministrationMessage.pre.checkboxProvider,
              dataProviders: [
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title:
                    socialInsuranceAdministrationMessage.pre
                      .skraInformationTitle,
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
                  options: getYesNoOptions(),
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'question.pensionFundAlert',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
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
                      name: socialInsuranceAdministrationMessage.pre
                        .startApplication,
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
      title: socialInsuranceAdministrationMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'periodSection',
      title: socialInsuranceAdministrationMessage.period.title,
      children: [],
    }),
    buildSection({
      id: 'fileUpload',
      title: socialInsuranceAdministrationMessage.fileUpload.title,
      children: [],
    }),
    buildSection({
      id: 'additionalInformation',
      title: socialInsuranceAdministrationMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: socialInsuranceAdministrationMessage.conclusionScreen.section,
      children: [],
    }),
  ],
})
