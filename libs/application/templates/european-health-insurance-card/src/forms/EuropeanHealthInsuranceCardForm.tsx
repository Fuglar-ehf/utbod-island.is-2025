import { Application, DefaultEvents } from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getDefaultValuesForPDFApplicants,
  getEhicResponse,
  getFullName,
  hasAPDF,
  hasPlastic,
  someAreInsuredButCannotApply,
  someAreNotInsured,
  someCanApplyForPlastic,
  someCanApplyForPlasticOrPdf,
  someHavePDF,
  someHavePlasticButNotPdf,
} from '../lib/helpers/applicantHelper'

import { CardResponse, Answer } from '../lib/types'
import { Option } from '@island.is/application/types'
import { Sjukra } from '../assets'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const EuropeanHealthInsuranceCardForm: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardForm',
  title: '',
  logo: Sjukra,
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [],
    }),
    buildSection({
      id: 'plastic',
      title: e.applicants.sectionLabel,
      children: [
        buildMultiField({
          id: 'delimitations',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          condition: (_, externalData) =>
            someCanApplyForPlasticOrPdf(externalData),
          children: [
            buildCheckboxField({
              id: 'delimitations.applyForPlastic',
              backgroundColor: 'white',
              title: '',
              condition: (_, externalData) =>
                someCanApplyForPlastic(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.canApply) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                    })
                  }
                })
                return applying
              },
            }),

            buildDescriptionField({
              id: 'break1',
              title: '',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
              condition: (_, externalData) =>
                someHavePlasticButNotPdf(externalData),
            }),

            buildCheckboxField({
              id: 'delimitations.addForPDF',
              backgroundColor: 'white',
              title: e.temp.sectionCanTitle,
              description: '',
              condition: (_, externalData) =>
                someHavePlasticButNotPdf(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []

                getEhicResponse(application).forEach((x) => {
                  if (x.canApplyForPDF) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                    })
                  }
                })

                return applying
              },
            }),

            buildDescriptionField({
              id: 'break2',
              title: '',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
              condition: (_, externalData) => someHavePDF(externalData),
            }),

            buildCheckboxField({
              id: 'havePdf',
              backgroundColor: 'white',
              title: e.temp.sectionHasPDFLabel,
              description: '',
              condition: (_, externalData) => someHavePDF(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.isInsured && hasAPDF(x)) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                      disabled: true,
                    })
                  }
                })
                return applying
              },
            }),

            buildDescriptionField({
              id: 'break3',
              title: '',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
              condition: (_, externalData) => someAreNotInsured(externalData),
            }),

            buildCheckboxField({
              id: 'notApplicable',
              backgroundColor: 'white',
              title: e.no.sectionTitle,
              description: e.no.sectionDescription,
              condition: (_, externalData) =>
                someAreNotInsured(externalData) ||
                someAreInsuredButCannotApply(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []
                getEhicResponse(application).forEach((x) => {
                  if (
                    !x.canApply &&
                    !x.canApplyForPDF &&
                    !hasAPDF(x) &&
                    !hasPlastic(x)
                  ) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                      disabled: true,
                    })
                  }
                })
                return applying
              },
            }),
          ],
        }),
        buildDescriptionField({
          condition: (_, externalData) =>
            !someCanApplyForPlasticOrPdf(externalData),
          id: 'noInsurance',
          title: e.no.sectionLabel,
          description: e.no.sectionDescription,
        }),
      ],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [
        buildMultiField({
          id: 'tempApplicants',
          title: e.temp.sectionTitle,
          description: e.temp.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'applyForPDF',
              backgroundColor: 'white',
              title: '',

              options: (application: Application) => {
                const applying = []
                // Are applying for a new plastic card
                const answers = (application.answers as unknown) as Answer
                const ans = answers.delimitations.applyForPlastic
                for (const i in ans) {
                  applying.push({
                    value: ans[i],
                    label: getFullName(application, ans[i]) ?? '',
                  })
                }

                // Find those who have been issued plastic cards
                const cardResponse = application.externalData.cardResponse
                  .data as CardResponse[]

                cardResponse.forEach((x) => {
                  if (x.canApplyForPDF) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                    })
                  }
                })

                return applying
              },
              defaultValue: (application: Application) =>
                getDefaultValuesForPDFApplicants(application),
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicationReviewSection.applicationReview',
          title: e.review.sectionReviewTitle,
          description: e.review.sectionReviewDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: e.review.submitButtonLabel,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused4',
          title: '',
          description: '',
        }),
      ],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardForm
