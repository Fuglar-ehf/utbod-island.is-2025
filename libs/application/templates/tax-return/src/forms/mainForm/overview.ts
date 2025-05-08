import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { getOverviewItems } from '../../utils/getOverviewItems'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: 'Yfirlit',
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: 'Yfirlit',
      children: [
        buildOverviewField({
          id: 'overview',
          title: 'Yfirlit',
          description: 'Yfirlit yfir skattframtal',
          backId: 'idToSomeField',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Senda skattframtal',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Senda skattframtal',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
