import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  confirmation,
  externalData,
  information,
  payment,
  personal,
  review,
  supportingDocuments,
} from '../../lib/messages'
import {
  ChildrenCustodyInformationApi,
  CountriesApi,
  NationalRegistryBirthplaceApi,
  NationalRegistryIndividualApi,
  NationalRegistryParentsApi,
  NationalRegistrySpouseDetailsApi,
  OldCountryOfResidenceListApi,
  OldForeignCriminalRecordFileListApi,
  OldPassportItemApi,
  OldStayAbroadListApi,
  ResidenceConditionsApi,
  TravelDocumentTypesApi,
  UserProfileApi,
  UtlendingastofnunPaymentCatalogApi,
} from '../../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: externalData.dataProvider.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.dataProvider.subTitle,
          description: externalData.dataProvider.description,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryIndividualApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseDetailsApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: NationalRegistryBirthplaceApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: NationalRegistryParentsApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              title: externalData.directorateOfImmigration.title,
              subTitle: externalData.directorateOfImmigration.subTitle,
            }),
            buildDataProviderItem({
              provider: ResidenceConditionsApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: CountriesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: TravelDocumentTypesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldCountryOfResidenceListApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldStayAbroadListApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldPassportItemApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldForeignCriminalRecordFileListApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: UtlendingastofnunPaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              pageTitle: externalData.dataProvider.subTitle2,
              title: '',
            }),
            buildDataProviderItem({
              id: 'meansOfSupport',
              title: externalData.icelandRevenueAndCustoms.title,
              subTitle: externalData.icelandRevenueAndCustoms.subTitle,
            }),
            buildDataProviderItem({
              title: externalData.nationalRegistry2.title,
              subTitle: externalData.nationalRegistry2.subTitle,
            }),
            buildDataProviderItem({
              title: externalData.nationalCommissionerOfPolice.title,
              subTitle: externalData.nationalCommissionerOfPolice.subTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'personal',
      title: personal.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'information',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'supportingDocuments',
      title: supportingDocuments.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'review',
      title: review.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
