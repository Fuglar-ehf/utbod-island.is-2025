import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { TaxReturnData } from '../../lib/data-types'

export const secondSection = buildSection({
  id: 'assets',
  title: 'Eignir ársins ' + new Date().getFullYear(),
  children: [
    buildMultiField({
      id: 'carOverview',
      title: 'Yfirlit yfir bíla',
      children: [
        buildDescriptionField({
          id: 'carData',
          title: '',
          description: ({ externalData }) => {
            const cars =
              (externalData?.getData?.data as TaxReturnData)?.cars ?? []
            if (!cars.length) return 'Engir bílar skráðir.'
            return cars
              .map(
                (car) =>
                  `${car.registrationNumber} (${
                    car.yearBought
                  }) - ${car.amount.toLocaleString()} kr.`,
              )
              .join('\n')
          },
        }),
      ],
    }),
  ],
})
