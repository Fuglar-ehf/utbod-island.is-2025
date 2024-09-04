import { z } from 'zod'
import { error } from './messages'
import { AnswerOption } from './constants'

export const memberItemSchema = z
  .object({
    name: z.string().optional(),
    before: z.string().optional(),
    below: z.string().optional(),
    above: z.string().optional(),
    after: z.string().optional(),
  })
  .partial()

export const membersSchema = z.array(memberItemSchema).optional()

export const regularSignatureItemSchema = z
  .object({
    date: z.string().optional(),
    institution: z.string().optional(),
    members: membersSchema.optional(),
    additionalSignature: z.string().optional(),
    html: z.string().optional(),
  })
  .partial()

export const regularSignatureSchema = z
  .array(regularSignatureItemSchema)
  .optional()

export const signatureInstitutionSchema = z.enum(['institution', 'date'])

export const committeeSignatureSchema = regularSignatureItemSchema
  .extend({
    chairman: memberItemSchema.optional(),
  })
  .partial()

export const channelSchema = z
  .object({
    email: z.string(),
    phone: z.string(),
  })
  .partial()

const advertSchema = z
  .object({
    departmentId: z.string().optional(),
    typeId: z.string().optional(),
    title: z.string().optional(),
    html: z.string().optional(),
    requestedDate: z.string().optional(),
    categories: z.array(z.string()).optional(),
    channels: z.array(channelSchema).optional(),
    message: z.string().optional(),
  })
  .partial()

const miscSchema = z
  .object({
    signatureType: z.string().optional(),
    selectedTemplate: z.string().optional(),
  })
  .partial()

export const partialSchema = z.object({
  requirements: z
    .object({
      approveExternalData: z.string(),
    })
    .refine((schema) => schema.approveExternalData === AnswerOption.YES, {
      params: error.dataGathering,
      path: ['approveExternalData'],
    }),
  advert: advertSchema.optional(),
  signatures: z
    .object({
      additionalSignature: z.object({
        committee: z.string().optional(),
        regular: z.string().optional(),
      }),
      regular: z.array(regularSignatureItemSchema).optional(),
      committee: committeeSignatureSchema.optional(),
    })
    .partial()
    .optional(),
  misc: miscSchema.optional(),
})

const advertValidation = (advert: z.infer<typeof advertSchema>) => {
  if (
    !advert ||
    !advert.typeId ||
    !advert.title ||
    !advert.html ||
    !advert.requestedDate ||
    !advert.categories
  ) {
    return false
  }

  return true
}

const memberValidation = (members?: z.infer<typeof memberItemSchema>[]) => {
  if (!members || members.length === 0) {
    return false
  }

  for (const member of members) {
    if (!member || !member.name) {
      return false
    }
  }

  return true
}

const signatureValidation = (
  signatures: z.infer<typeof regularSignatureItemSchema>[],
) => {
  if (!signatures || signatures.length === 0) {
    return false
  }

  for (const signature of signatures) {
    if (!signature || !signature.date || !signature.institution) {
      return false
    }

    if (!memberValidation(signature.members)) {
      return false
    }
  }

  return true
}

export const validationSchema = z.object({
  advert: z.object({
    departmentId: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingDepartment,
      }),
    typeId: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingType,
      }),
    title: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingTitle,
      }),
    html: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingHtml,
      }),
    requestedDate: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        // TODO: Add date validation
        params: error.missingRequestedDate,
      }),
    categories: z
      .array(z.string())
      .optional()
      .refine((value) => Array.isArray(value) && value.length > 0, {
        params: error.noCategorySelected,
      }),
    channels: z.array(channelSchema).optional(),
    message: z.string().optional(),
  }),
})

type Flatten<T> = T extends any[] ? T[number] : T

type MapProps<T> = {
  [K in keyof T]: T[K]
}

export type partialSchema = z.infer<typeof partialSchema>

export type partialRegularSignatureSchema = Flatten<
  z.infer<typeof regularSignatureItemSchema>
>

export type partialCommitteeSignatureSchema = MapProps<
  z.infer<typeof committeeSignatureSchema>
>

export type validationSchema = z.infer<typeof validationSchema>

export const signatureProperties = committeeSignatureSchema.keyof()

export const sharedSignatureProperties = signatureProperties
