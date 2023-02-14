import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'

import {
  EhicCardResponseApi,
} from '../dataProviders'
import { NationalRegistry } from '../lib/types'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const EuropeanHealthInsuranceCardApplyPlastic: Form = buildForm({
  id: 'EuropeanHealthInsurancePrerequisitiesForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,

      children: [
        buildCustomField(
          {
            id: 'introScreen',
            title: e.introScreen.sectionTitle,
            component: 'IntroScreen',
          },
          {
            subTitle: e.introScreen.sectionDescription,
          },
        ),
      ],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [
        buildExternalDataProvider({
          title: e.data.sectionTitle,
          checkboxLabel: e.data.dataCollectionCheckboxLabel,
          id: 'approveExternalData',
          description: '',
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: 'Þjóðskrá Íslands',
              subTitle:
                'Við þurfum að sækja þessi gögn úr þjóðskrá. Lögheimili, hjúskaparstaða, maki og afkvæmi.',
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: EhicCardResponseApi,
              title: 'Sjúkratryggingar',
              subTitle:
                'Upplýsingar um stöðu heimildar á evrópska sjúktryggingakortinu',
            }),
          ],
        }),
        buildMultiField({
          id: 'plastic',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'applyForPlastic',
              backgroundColor: 'white',
              title: '',
              options: (application: Application) => {
                console.log(application, " here")
                const nationalRegistry = application.externalData.nationalRegistry.data as NationalRegistry
                const nationalRegistrySpouse = application.externalData.nationalRegistrySpouse.data as NationalRegistry
                const nationalRegistryDataChildren = (application?.externalData?.childrenCustodyInformation as unknown) as NationalRegistry
                const applying = [];

                applying.push(
                  {
                    value: [nationalRegistry.nationalId, nationalRegistry.fullName],
                    label: nationalRegistry.fullName,
                  }
                )
                applying.push(
                  {
                    value: [nationalRegistrySpouse.nationalId, nationalRegistrySpouse.name],
                    label: nationalRegistrySpouse.name,
                  }
                )

                for (const i in nationalRegistryDataChildren.data) {
                  applying.push(
                    {
                      value: [nationalRegistryDataChildren.data[i].nationalId, nationalRegistryDataChildren.data[i].fullName],
                      label: nationalRegistryDataChildren.data[i].fullName,
                    }
                  )
                }
                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildSubmitField({
              id: 'submit',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Sækja um plast',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),

        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        // buildDescriptionField({
        //   id: 'unused',
        //   title: '',
        //   description: '',
        // }),
      ],
    }),

    buildSection({
      id: 'applicants',
      title: e.applicants.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicants',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          children: [
            buildCustomField({
              id: 'applicants',
              title: '',
              component: 'Applicants',
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),
  ],
})
