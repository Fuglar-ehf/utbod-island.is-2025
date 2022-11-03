import { z } from 'zod'
import { error } from './messages'
import * as kennitala from 'kennitala'
import { FishingLicenseEnum } from '../types'
import { applicantInformationSchema } from '@island.is/application/ui-forms'

export const GeneralFishingLicenseSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    identityRegistry: z.object({
      data: z.object({
        date: z.string(),
        status: z.enum(['success', 'failure']),
        name: z.string(),
        nationalId: z.string(),
        address: z.object({
          streetAddress: z.string(),
          city: z.string(),
          postalCode: z.string(),
        }),
      }),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
    }),
  }),
  applicant: applicantInformationSchema,
  shipSelection: z.object({
    ship: z.enum(['0', '1', '2', '3', '4', '5']).refine((x) => x, {
      params: error.requiredRadioField,
    }),
    registrationNumber: z.string(),
  }),
  fishingLicense: z.object({
    license: z
      .enum([FishingLicenseEnum.HOOKCATCHLIMIT, FishingLicenseEnum.CATCHLIMIT])
      .refine((x) => x, {
        params: error.requiredRadioField,
      }),
    chargeType: z.string().min(1),
  }),
})

export type GeneralFishingLicense = z.TypeOf<typeof GeneralFishingLicenseSchema>
