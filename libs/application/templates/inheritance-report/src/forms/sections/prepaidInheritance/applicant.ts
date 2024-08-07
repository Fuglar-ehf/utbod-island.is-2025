import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildSection,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { UserProfile, Application } from '@island.is/api/schema'
import { removeCountryCode } from '@island.is/application/ui-components'
import { m } from '../../../lib/messages'
import { RelationEnum } from '../../../types'

export const prePaidApplicant = buildSection({
  id: 'applicantsInformation',
  title: m.applicantsInfo,
  children: [
    buildMultiField({
      id: 'prePaidApplicant',
      title: m.applicantsInfo,
      description: m.applicantsInfoSubtitle,
      children: [
        buildNationalIdWithNameField({
          id: 'prePaidApplicant',
          title: m.name,
          width: 'full',
          required: true,
        }),
        buildTextField({
          id: 'prePaidApplicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          format: '###-####',
          defaultValue: (application: Application) => {
            const phone =
              (
                application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                }
              )?.mobilePhoneNumber ?? ''

            return removeCountryCode(phone)
          },
        }),
        buildTextField({
          id: 'prePaidApplicant.email',
          title: m.email,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile?.data as UserProfile
            return data?.email
          },
        }),
        buildSelectField({
          id: 'prePaidApplicant.relation',
          title: m.heirsRelation,
          width: 'half',
          required: true,
          options: [
            { label: m.heir, value: RelationEnum.HEIR },
            { label: m.representative, value: RelationEnum.REPRESENTATIVE },
            { label: m.grantor, value: RelationEnum.GRANTOR },
          ],
        }),
      ],
    }),
  ],
})
