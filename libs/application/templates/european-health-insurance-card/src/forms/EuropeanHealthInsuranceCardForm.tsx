import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  MaybeWithApplicationAndField,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { CardResponse, NationalRegistry } from '../lib/types'
import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getDefaultValuesForPDFApplicants,
  getEhicResponse,
  getFromRegistry,
  getFullName,
  hasAPDF,
  someAreNotInsured,
  someCanApplyForPlastic,
  someCanApplyForPlasticOrPdf,
  someHavePDF,
  someHavePlasticButNotPdf,
} from '../lib/helpers/applicantHelper'

import { Sjukra } from '../assets'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps { }

export const EuropeanHealthInsuranceCardForm: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardForm',
  title: '',
  logo: Sjukra,
  mode: FormModes.DRAFT,
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
          id: 'plastic',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          condition: (_, externalData) =>
            someCanApplyForPlasticOrPdf(externalData),
          children: [
            buildCheckboxField({
              id: 'applyForPlastic',
              backgroundColor: 'white',
              title: '',
              condition: (_, externalData) =>
                someCanApplyForPlastic(externalData),
              options: (application: Application) => {
                const applying: Array<any> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.canApply) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                    })
                  }
                })
                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildCheckboxField({
              id: 'addForPDF',
              backgroundColor: 'white',
              title: e.temp.sectionCanTitle,
              condition: (_, externalData) =>
                someHavePlasticButNotPdf(externalData),
              options: (application: Application) => {
                const applying: Array<any> = []

                getEhicResponse(application).forEach((x) => {
                  if (x.isInsured && !x.canApply && !hasAPDF(x)) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel:
                        e.temp.sectionHasPlasticLabel,
                    })
                  }
                })

                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildCheckboxField({
              id: 'havePdf',
              backgroundColor: 'white',
              title: 'Eiga pdf',
              condition: (_, externalData) => someHavePDF(externalData),
              options: (application: Application) => {
                console.log(application, 'notApplicable')
                const applying: Array<any> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.isInsured && hasAPDF(x)) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel:
                        "m.noDeprivedDrivingLicenseInOtherCountryDescription.defaultMessage",
                      disabled: true,
                    })
                  }
                })
                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildCheckboxField({
              id: 'notApplicable',
              backgroundColor: 'white',
              title: "",
              description: e.no.sectionDescription,
              condition: (_, externalData) => someAreNotInsured(externalData),
              options: (application: Application) => {
                console.log(application, 'notApplicable')
                const applying: Array<any> = []
                getEhicResponse(application).forEach((x) => {
                  if (!x.isInsured && !x.canApply) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel: e.no.sectionSubDescription,
                      disabled: true,
                    })
                  }
                })
                return applying as Array<{ value: any; label: string }>
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
                const ans = application.answers.applyForPlastic as Array<any>

                for (const i in ans) {
                  applying.push({
                    value: ans[i],
                    label: getFullName(application, ans[i]),
                  })
                }

                // Find those who have been issued plastic cards
                const cardResponse = application.externalData.cardResponse
                  .data as CardResponse[]

                cardResponse.forEach((x) => {
                  if (x.isInsured && !x.canApply) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                    })
                  }
                })

                return applying as Array<{ value: any; label: string }>
              },
              defaultValue: (application: Application) =>
                getDefaultValuesForPDFApplicants(application),
            }),
            buildSubmitField({
              id: 'submit-pdf',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: e.temp.submitButtonLabel,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        buildDescriptionField({
          id: 'pdf-Unused',
          title: '',
          description: '',
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardForm
