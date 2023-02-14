import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
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

import { NationalRegistry } from '../lib/types'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps { }

export const EuropeanHealthInsuranceCardApplyPDF: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: '',
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
      id: 'applicants',
      title: e.applicants.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [
        buildMultiField({
          id: 'temp-mf',
          title: e.temp.sectionTitle,
          description: e.temp.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'applyForPDF',
              backgroundColor: 'white',
              title: '',
              options: (application: Application) => {
                const applying = [];
                const ans = application.answers.applyForPlastic as Array<any>
                for (const i in ans) {
                  console.log([ans[i][0], ans[i][1]])
                  applying.push(
                    {
                      value: [ans[i][0], ans[i][1]],
                      label: ans[i][1],
                    }
                  )
                }
                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildSubmitField({
              id: 'submit-23',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'pdf-button',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused2',
          title: 'no way',
          description: 'fyrir neðan',
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardApplyPDF
