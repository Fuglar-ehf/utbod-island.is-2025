import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './error'
import { Services } from './constants'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  passport: z
    .object({
      userPassport: z.string(),
      childPassport: z.string(),
    })
    .partial()
    .refine(
      ({ userPassport, childPassport }) => userPassport || childPassport,
      {
        message: error.invalidValue.defaultMessage,
        path: ['userPassport'],
      },
    ),
  personalInfo: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    email: z
      .string()
      .refine((v) => isValidEmail(v), { params: error.invalidValue }),
    phoneNumber: z
      .string()
      .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
    hasDisabilityDiscount: z.array(z.string()).optional(),
  }),
  childsPersonalInfo: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    guardian1: z.object({
      name: z.string().nonempty(),
      nationalId: z
        .string()
        .refine((x) => (x ? nationalIdRegex.test(x) : false)),
      email: z
        .string()
        .refine((v) => isValidEmail(v), { params: error.invalidValue }),
      phoneNumber: z
        .string()
        .min(7)
        .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
    }),
    guardian2: z.object({
      name: z.string().nonempty(),
      nationalId: z
        .string()
        .refine((x) => (x ? nationalIdRegex.test(x) : false)),
      email: z
        .string()
        .refine((v) => isValidEmail(v), { params: error.invalidValue }),
      phoneNumber: z
        .string()
        .min(7)
        .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
    }),
  }),
  service: z.object({
    type: z.enum([Services.REGULAR, Services.EXPRESS]),
    dropLocation: z.string().nonempty(),
  }),
  approveExternalDataParentB: z.boolean().refine((v) => v),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
