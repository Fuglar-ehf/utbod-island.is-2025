import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'

import { TaxDataApi, UserInfoApi } from '../../dataProviders'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: 'Forkröfur',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Gagnaöflun',
          dataProviders: [
            buildDataProviderItem({
              provider: TaxDataApi,
              title: 'Ríkisskattstjóri',
            }),
            buildDataProviderItem({
              provider: UserInfoApi,
              title: 'Þjóðskrá',
            }),
            // Add more data providers as needed
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
