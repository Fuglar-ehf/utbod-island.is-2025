import { YES, getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  ApplicationEligibility,
  ApplicationEligibilityRequirement,
  RequirementKey,
} from '../../types/schema'
import { useQuery, gql } from '@apollo/client'
import {
  License,
  codesExtendedLicenseCategories,
  codesRequiringHealthCertificate,
  DrivingLicense,
  DrivingLicenseFakeData,
  otherLicenseCategories,
  remarksCannotRenew65,
} from '../../lib/constants'
import { fakeEligibility } from './fakeEligibility'

const QUERY = gql`
  query EligibilityQuery($input: ApplicationEligibilityInput!) {
    drivingLicenseApplicationEligibility(input: $input) {
      isEligible
      requirements {
        key
        requirementMet
        daysOfResidency
      }
    }
  }
`
export interface UseEligibilityResult {
  error?: Error
  eligibility?: ApplicationEligibility
  loading: boolean
}

export const useEligibility = (
  application: Application,
): UseEligibilityResult => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(
    application.answers,
    'fakeData',
  )
  const usingFakeData = fakeData?.useFakeData === YES

  const applicationFor =
    getValueViaPath(application.answers, 'applicationFor', License.B_FULL) ??
    License.B_FULL

  const {
    data = {},
    error,
    loading,
  } = useQuery(QUERY, {
    skip: usingFakeData,
    variables: {
      input: {
        applicationFor,
      },
    },
  })

  const currentLicense = getValueViaPath<DrivingLicense>(
    application.externalData,
    'currentLicense.data',
  )
  const hasQualityPhoto =
    getValueViaPath<boolean>(
      application.externalData,
      'qualityPhoto.data.hasQualityPhoto',
    ) ?? false

  const hasExtendedDrivingLicense = (
    currentLicense: DrivingLicense | undefined,
    drivingLicenseIssued: string | undefined,
  ): boolean => {
    if (!drivingLicenseIssued) return false

    const relevantCategories = currentLicense?.categories?.filter((x) =>
      codesExtendedLicenseCategories.includes(x.nr),
    )

    if (!relevantCategories?.length) return false

    // Check if any category was issued on a different date than the 'B' license
    // (indicating an extended license)
    return relevantCategories.some((x) => x.issued !== drivingLicenseIssued)
  }

  if (usingFakeData) {
    return {
      loading: false,
      eligibility: fakeEligibility(
        applicationFor,
        parseInt(fakeData?.howManyDaysHaveYouLivedInIceland.toString(), 10),
      ),
    }
  }

  if (error) {
    console.error(error)
    return {
      loading: false,
      error: error,
    }
  }

  const eligibility: ApplicationEligibilityRequirement[] =
    data.drivingLicenseApplicationEligibility?.requirements ?? []

  if (application.answers.applicationFor === License.B_FULL_RENEWAL_65) {
    const licenseB = currentLicense?.categories?.find(
      (license) => license.nr === 'B',
    )
    const drivingLicenseIssued = licenseB?.issued

    const hasExtendedLicense = hasExtendedDrivingLicense(
      currentLicense,
      drivingLicenseIssued,
    )

    const hasAnyInvalidRemarks =
      currentLicense?.remarks?.some((remark) =>
        remarksCannotRenew65.includes(remark.code),
      ) ?? false

    const requirements = [
      ...eligibility,
      {
        key: RequirementKey.HasNoPhoto,
        requirementMet: hasQualityPhoto,
      },
      ...(hasExtendedLicense
        ? [
            {
              key: RequirementKey.NoExtendedDrivingLicense,
              requirementMet: false,
            },
          ]
        : []),
    ]

    return {
      loading: loading,
      eligibility: {
        isEligible: loading
          ? undefined
          : (data.drivingLicenseApplicationEligibility?.isEligible ?? false) &&
            !hasExtendedLicense &&
            !hasAnyInvalidRemarks,
        requirements,
      },
    }
  }

  return {
    loading,
    eligibility: data.drivingLicenseApplicationEligibility,
  }
}
