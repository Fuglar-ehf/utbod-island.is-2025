import {
  validateContactInfo,
  validateCounterParty,
  validateTerms,
} from '@island.is/application/templates/family-matters-core/utils/dataSchema'
import { error } from './messages/index'
import * as z from 'zod'

enum Duration {
  Permanent = 'permanent',
  Temporary = 'temporary',
}

export enum ApproveContract {
  Yes = 'yes',
  No = 'no',
}

const {
  counterParty,
  invalidEmail,
  invalidPhoneNumber,
  approveTerms,
} = error.validation

const parentContactInfo = validateContactInfo({
  email: invalidEmail,
  phone: invalidPhoneNumber,
})

export const dataSchema = z.object({
  useMocks: z.enum(['yes', 'no']).optional(),
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  selectedChildren: z
    .array(z.string())
    .refine((v) => v && v.length > 0, { params: error.validation.selectChild }),
  residenceChangeReason: z.string().optional(),
  parentA: parentContactInfo,
  counterParty: validateCounterParty({
    email: invalidEmail,
    phone: invalidPhoneNumber,
    counterParty,
  }),
  parentB: parentContactInfo,
  approveTerms: validateTerms(approveTerms),
  approveTermsParentB: validateTerms(approveTerms),
  approveChildSupportTerms: validateTerms(approveTerms),
  approveChildSupportTermsParentB: validateTerms(approveTerms),
  selectDuration: z
    .object({
      type: z.enum([Duration.Permanent, Duration.Temporary]).refine((v) => v, {
        params: error.validation.durationType,
      }),
      date: z.string().optional(),
    })
    .refine((v) => (v.type === Duration.Temporary ? v.date : true), {
      params: error.validation.durationDate,
      path: ['date'],
    }),
  confirmContract: validateTerms(approveTerms),
  confirmContractParentB: validateTerms(approveTerms),
  acceptContract: z
    .enum([ApproveContract.Yes, ApproveContract.No])
    .refine((v) => v, {
      params: error.validation.acceptContract,
    }),
})

export type answersSchema = z.infer<typeof dataSchema>
