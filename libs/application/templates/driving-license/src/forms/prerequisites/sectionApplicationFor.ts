import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'
import { m } from '../../lib/messages'
import { B_FULL, B_TEMP } from '../../shared'

export const sectionApplicationFor = buildSubSection({
  id: 'applicationFor',
  title: m.applicationDrivingLicenseTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.drivingLicenseApplyingForTitle,
      children: [
        buildRadioField({
          id: 'applicationFor',
          backgroundColor: 'white',
          title: '',
          description: '',
          space: 0,
          largeButtons: true,
          options: (app) => {
            const {
              currentLicense,
            } = getValueViaPath<CurrentLicenseProviderResult>(
              app.externalData,
              'currentLicense.data',
            ) ?? { currentLicense: null }

            return [
              {
                label: m.applicationForTempLicenseTitle,
                subLabel: m.applicationForTempLicenseDescription.defaultMessage,
                value: B_TEMP,
                disabled: !!currentLicense,
              },
              {
                label: m.applicationForFullLicenseTitle,
                subLabel: m.applicationForFullLicenseDescription.defaultMessage,
                value: B_FULL,
                disabled: !currentLicense,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
