import {
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  MockProviderApi,
  NationalRegistryUserApi,
  PaymentCatalogApi,
  UserProfileApi,
  DistrictsApi,
} from '@island.is/application/types'
import { ChildsPersonalInfo } from '../lib/constants'
import { m } from '../lib/messages'
import { childsOverview } from './overviewSection/childsOverview'

export const ParentB: Form = buildForm({
  id: 'PassportApplicationParentB',
  title: m.formName,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'introSection',
      title: m.introTitle,
      children: [
        buildMultiField({
          id: 'introParentB',
          title: m.formName,
          description: (application: Application) => ({
            ...m.parentBIntroText,
            values: {
              childsName: (application.answers
                .childsPersonalInfo as ChildsPersonalInfo)?.name,
              guardianName: (application.answers
                .childsPersonalInfo as ChildsPersonalInfo)?.guardian1.name,
            },
          }),
          children: [
            buildDividerField({
              title: ' ',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'externalDataSection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalDataParentB',
          title: m.formName,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              provider: MockProviderApi,
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
            buildDataProviderItem({
              provider: PaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: DistrictsApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSectionParentB',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'overviewSection',
          title: m.overviewSectionTitle,
          children: [
            ...childsOverview.children,
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
