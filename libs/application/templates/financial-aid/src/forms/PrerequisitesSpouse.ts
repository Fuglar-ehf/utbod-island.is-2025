import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { DataProviderTypes } from '../lib/types'

import * as m from '../lib/messages'
import { Routes } from '../lib/constants'

export const PrerequisitesSpouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'externalDataSpouse',
      title: m.section.dataGathering,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalDataSpouse',
          subTitle: m.externalData.general.subTitle,
          description: m.externalData.general.description,
          checkboxLabel: m.externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'taxDataFetchSpouse',
              type: DataProviderTypes.TaxDataFetch,
              title: m.externalData.taxData.title,
              subTitle: m.externalData.taxData.dataInfo,
            }),
            buildDataProviderItem({
              id: 'veita',
              type: DataProviderTypes.Veita,
              title: '',
              subTitle: undefined,
            }),
            buildDataProviderItem({
              id: 'moreTaxInfo',
              type: undefined,
              title: '',
              subTitle: m.externalData.taxData.process,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.SPOUSEACCECPTCONTRACT,
      title: m.aboutSpouseForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.SPOUSEACCECPTCONTRACT,
          title: m.aboutForm.general.pageTitle,
          children: [
            buildCustomField({
              id: Routes.SPOUSEACCECPTCONTRACT,
              title: m.aboutSpouseForm.general.pageTitle,
              component: 'AboutSpouseForm',
            }),
            buildSubmitField({
              id: 'toDraft',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.aboutForm.goToApplication.button,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // This is here to be able to show submit button on former screen :( :( :(
        buildMultiField({
          id: '',
          title: '',
          children: [],
        }),
      ],
    }),
  ],
})
