import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Juristiction } from '@island.is/api/schema'

export const sectionDelivery = buildSection({
  id: 'delivery',
  title: m.deliveryMethodSectionTitle,
  children: [
    buildMultiField({
      id: 'deliverySection',
      title: '',
      children: [
        buildDescriptionField({
          id: 'deliveryDescription',
          titleVariant: 'h3',
          title: m.deliveryMethodTitle,
          marginBottom: 2,
          description: m.deliveryMethodDescription,
        }),
        buildSelectField({
          id: 'district',
          title: m.deliveryMethodOfficeLabel,
          placeholder: m.deliveryMethodOfficeSelectPlaceholder,
          options: ({
            externalData: {
              juristictions: { data },
            },
          }) => {
            return (data as Juristiction[])
              .map(({ id, zip, name }) => ({
                value: id.toString(),
                label: `${zip} ${name}`,
              }))
              .sort((a, b) => parseInt(a.label, 10) - parseInt(b.label, 10))
          },
        }),
      ],
    }),
  ],
})
