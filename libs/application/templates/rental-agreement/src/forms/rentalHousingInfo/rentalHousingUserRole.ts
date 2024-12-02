import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
} from '@island.is/application/core'

import { userRole } from '../../lib/messages'
import { getUserRoleOptions } from '../../lib/utils'

export const RentalHousingUserRole = buildSubSection({
  id: 'userRole',
  title: userRole.subSectionName,
  children: [
    buildMultiField({
      id: 'userRole.multiField',
      title: userRole.pageTitle,
      description: userRole.pageDescription,
      children: [
        buildRadioField({
          id: 'userRole.type',
          title: '',
          options: getUserRoleOptions,
        }),
      ],
    }),
  ],
})
