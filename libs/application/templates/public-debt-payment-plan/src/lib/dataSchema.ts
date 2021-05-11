import { SuccessfulDataProviderResult } from '@island.is/application/core'
import * as z from 'zod'
import { Prerequisites } from '../dataProviders/tempAPITypes'
import { NO, YES } from '../shared/constants'

interface PrerequisitesResult extends SuccessfulDataProviderResult {
  data: Prerequisites
}

interface UserProfileResult extends SuccessfulDataProviderResult {
  data: {
    email: string
    mobilePhoneNumber: string
  }
}

interface NatRegResult extends SuccessfulDataProviderResult {
  data: {
    nationalId: string
    age: number
    fullName: string
    citizenship: {
      code: string
      name: string
    }
    legalResidence: string
    address: {
      code: string
      postalCode: string
      city: string
      streetAddress: string
      lastUpdated: string
    }
  }
}

export type PaymentPlanExternalData = {
  paymentPlanPrerequisites?: PrerequisitesResult
  nationalRegistry?: NatRegResult
  userProfile?: UserProfileResult
}

export const PublicDebtPaymentPlanSchema = z.object({
  // TODO: Applicant schema
  employer: z.object({
    isCorrectInfo: z.enum([YES, NO]),
    correctedNationalId: z.string().optional(),
  }),
  paymentPlanContext: z.object({
    isFulfilled: z.boolean().refine((x) => x),
    activePayment: z.string().optional(),
  }),
  paymentPlans: z.array(
    z.object({
      paymentPlan: z.object({
        // id: z.string(),
        // amount: z.string(),
        monthsTest: z.string(),
      }),
    }),
  ),
})

export type PublicDebtPaymentPlan = z.TypeOf<typeof PublicDebtPaymentPlanSchema>
