import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  BE,
  DrivingLicenseFakeData,
} from '../../lib/constants'

export const sectionApplicationFor = (
  allowBELicense = false,
  allow65Renewal = false,
) =>
  buildSubSection({
    id: 'applicationFor',
    title: m.applicationDrivingLicenseTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationDrivingLicenseTitle,
        description: m.drivingLicenseApplyingForTitle,
        children: [
          buildRadioField({
            id: 'applicationFor',
            title: '',
            backgroundColor: 'white',
            largeButtons: true,
            options: (app) => {
              let { currentLicense } = getValueViaPath<DrivingLicense>(
                app.externalData,
                'currentLicense.data',
              ) ?? { currentLicense: null }

              let { categories } = getValueViaPath<DrivingLicense>(
                app.externalData,
                'currentLicense.data',
              ) ?? { categories: null }

              const age =
                getValueViaPath<number>(
                  app.externalData,
                  'nationalRegistry.data.age',
                ) ?? 0

              const fakeData = getValueViaPath<DrivingLicenseFakeData>(
                app.answers,
                'fakeData',
              )
              if (fakeData?.useFakeData === 'yes') {
                currentLicense = fakeData.currentLicense ?? null
                categories =
                  fakeData.currentLicense === 'temp'
                    ? [{ nr: 'B', validToCode: 8 }]
                    : fakeData.currentLicense === 'full'
                    ? [{ nr: 'B', validToCode: 9 }]
                    : fakeData.currentLicense === 'BE'
                    ? [
                        { nr: 'B', validToCode: 9 },
                        { nr: 'BE', validToCode: 9 },
                      ]
                    : []
              }

              let options = [
                {
                  label: m.applicationForTempLicenseTitle,
                  subLabel:
                    m.applicationForTempLicenseDescription.defaultMessage,
                  value: B_TEMP,
                  disabled: !!currentLicense,
                },
                {
                  label: m.applicationForFullLicenseTitle,
                  subLabel:
                    m.applicationForFullLicenseDescription.defaultMessage,
                  value: B_FULL,
                  disabled: !currentLicense,
                },
              ]

              if (allow65Renewal) {
                options = options.concat({
                  label: m.applicationForRenewalLicenseTitle,
                  subLabel:
                    m.applicationForRenewalLicenseDescription.defaultMessage,
                  value: B_FULL_RENEWAL_65,
                  disabled:
                    !currentLicense ||
                    (fakeData && fakeData.age ? fakeData.age < 65 : age < 65),
                })
              }

              if (allowBELicense) {
                options = options.concat({
                  label: m.applicationForBELicenseTitle,
                  subLabel: m.applicationForBELicenseDescription.defaultMessage,
                  value: BE,
                  disabled:
                    !currentLicense ||
                    age < 18 ||
                    age >= 65 ||
                    categories?.some((c) => c.nr.toUpperCase() === 'BE') ||
                    // validToCode === 8 is temporary license and should not be applicable for BE
                    !categories?.some(
                      (c) => c.nr.toUpperCase() === 'B' && c.validToCode !== 8,
                    ),
                })
              }

              return options
            },
          }),
        ],
      }),
    ],
  })
