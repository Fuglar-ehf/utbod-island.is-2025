import * as z from 'zod'
import { YES, NO } from '../shared'
import { error } from './messages/error'
import * as kennitala from 'kennitala'
import { DefaultEvents } from '@island.is/application/core'

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  OTHERS = 'others',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const DataProtectionComplaintSchema = z.object({
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
          streetAddress: z.string(),
        }),
        age: z.number(),
        citizenship: z.object({
          code: z.string(),
          name: z.string(),
        }),
        fullName: z.string(),
        legalResidence: z.string(),
        nationalId: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
  }),
  approveExternalData: z.boolean().refine((p) => p),
  inCourtProceedings: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.inCourtProceedings.defaultMessage,
  }),
  concernsMediaCoverage: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.concernsMediaCoverage.defaultMessage,
  }),
  concernsBanMarking: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.concernsBanMarking.defaultMessage,
  }),
  concernsLibel: z.enum([YES, NO]).refine((p) => p === NO, {
    message: error.concernsLibel.defaultMessage,
  }),
  info: z.object({
    onBehalf: z.enum([
      OnBehalf.MYSELF,
      OnBehalf.MYSELF_AND_OR_OTHERS,
      OnBehalf.OTHERS,
      OnBehalf.ORGANIZATION_OR_INSTITUTION,
    ]),
  }),
  applicant: z.object({
    name: z.string().nonempty(error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().nonempty(error.required.defaultMessage),
    postalCode: z.string().nonempty(error.required.defaultMessage),
    city: z.string().nonempty(error.required.defaultMessage),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  organizationOrInstitution: z.object({
    name: z.string().nonempty(error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isCompany(x) : false)),
    address: z.string().nonempty(error.required.defaultMessage),
    postalCode: z.string().nonempty(error.required.defaultMessage),
    city: z.string().nonempty(error.required.defaultMessage),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  commissions: z.object({
    documents: z.array(FileSchema).nonempty(),
    persons: z
      .array(
        z.object({
          name: z.string().nonempty(error.required.defaultMessage),
          nationalId: z
            .string()
            .refine((x) => (x ? kennitala.isPerson(x) : false)),
        }),
      )
      .nonempty(),
  }),
  complainees: z.array(
    z.object({
      name: z.string().nonempty(error.required.defaultMessage),
      address: z.string().nonempty(error.required.defaultMessage),
      nationalId: z
        .string()
        .refine((x) => (x ? kennitala.isValid(x) : false))
        .optional(),
      operatesWithinEurope: z.enum([YES, NO]),
      countryOfOperation: z.string().optional(),
    }),
  ),
  subjectOfComplaint: z.object({
    values: z.array(z.string()).optional(),
    somethingElse: z.string().optional(),
  }),
  complaint: z.object({
    description: z
      .string()
      .nonempty(error.required.defaultMessage)
      .refine(
        (x) => x?.split(' ').length <= 500,
        error.wordCountReached.defaultMessage,
      ),
    documents: z.array(FileSchema).nonempty(),
  }),
  overview: z.object({
    termsAgreement: z.string().refine((x) => x === DefaultEvents.SUBMIT),
  }),
})

export type DataProtectionComplaint = z.TypeOf<
  typeof DataProtectionComplaintSchema
>
