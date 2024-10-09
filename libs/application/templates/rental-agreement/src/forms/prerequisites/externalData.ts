import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { UserProfileApi, NationalRegistryUserApi } from '../../dataProviders'
import * as m from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const externalData = buildSection({
  id: 'externalData',
  title: m.prerequisites.externalData.sectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prerequisites.externalData.pageTitle,
      subTitle: m.prerequisites.externalData.subTitle,
      checkboxLabel: m.prerequisites.externalData.checkboxLabel,
      submitField: buildSubmitField({
        id: 'toDraft',
        title: '',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: 'Hefja umsókn',
            type: 'primary',
          },
        ],
      }),
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prerequisites.externalData.currentApplicationTitle,
          subTitle: m.prerequisites.externalData.currentApplicationSubTitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.prerequisites.externalData.nationalRegistryTitle,
          subTitle: m.prerequisites.externalData.nationalRegistrySubTitle,
        }),
      ],
    }),
  ],
})
