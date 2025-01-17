import { z } from 'zod'
import * as kennitala from 'kennitala'
import { IndividualOrCompany, PaymentOptions } from '../shared/contstants'
import { isValidEmail, isValidPhoneNumber } from '../utils'
import { YES } from '@island.is/application/types'

const UserSchemaBase = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId &&
        nationalId.length !== 0 &&
        kennitala.isValid(nationalId) &&
        (kennitala.isCompany(nationalId) ||
          kennitala.info(nationalId).age >= 18),
    ),
  name: z.string().min(1),
})

export const PaymentArrangementSchema = z
  .object({
    individualOrCompany: z.nativeEnum(IndividualOrCompany),
    paymentOptions: z.nativeEnum(PaymentOptions).optional(),
    companyInfo: z
      .object({
        nationalId: z.string().optional(),
        label: z.string().optional(),
      })
      .optional(),
    individualInfo: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    contactInfo: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    explanation: z.string().optional(),
    agreementCheckbox: z.array(z.string()).refine((v) => v.includes(YES)),
  })
  .refine(
    ({ individualInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.company) return true
      return (
        individualOrCompany === IndividualOrCompany.individual &&
        individualInfo &&
        individualInfo.email &&
        individualInfo.email.length > 0 &&
        isValidEmail(individualInfo.email)
      )
    },
    {
      path: ['individualInfo', 'email'],
    },
  )
  .refine(
    ({ individualInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.company) return true
      return (
        individualOrCompany === IndividualOrCompany.individual &&
        individualInfo &&
        individualInfo.phone &&
        isValidPhoneNumber(individualInfo?.phone)
      )
    },
    {
      path: ['individualInfo', 'phone'],
    },
  )
  .refine(
    ({ companyInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        companyInfo &&
        companyInfo.label &&
        companyInfo.nationalId &&
        companyInfo.nationalId.length > 0 &&
        kennitala.isCompany(companyInfo.nationalId)
      )
    },
    {
      path: ['companyInfo', 'nationalId'],
    },
  )
  .refine(
    ({ paymentOptions, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        (paymentOptions === PaymentOptions.cashOnDelivery ||
          paymentOptions === PaymentOptions.putIntoAccount)
      )
    },
    {
      path: ['paymentOptions'],
    },
  )
  .refine(
    ({ contactInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        contactInfo &&
        contactInfo.email &&
        contactInfo.email.length > 0 &&
        isValidEmail(contactInfo.email)
      )
    },
    {
      path: ['contactInfo', 'email'],
    },
  )
  .refine(
    ({ contactInfo, individualOrCompany }) => {
      if (individualOrCompany === IndividualOrCompany.individual) return true
      return (
        individualOrCompany === IndividualOrCompany.company &&
        contactInfo &&
        contactInfo.phone &&
        contactInfo.phone.length > 0 &&
        isValidPhoneNumber(contactInfo.phone)
      )
    },
    {
      path: ['contactInfo', 'phone'],
    },
  )

export const UserInformationSchema = z.intersection(
  UserSchemaBase,
  z.object({
    approved: z.boolean().optional(),
  }),
)

export const ParticipantSchema = z.object({
  name: z.string().min(1),
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  email: z
    .string()
    .min(1)
    .refine((x) => isValidEmail(x)),
  phoneNumber: z
    .string()
    .min(1)
    .refine((x) => isValidPhoneNumber(x)),
  disabled: z.string().optional(),
})

export const SeminarAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: UserInformationSchema,
  paymentArrangement: PaymentArrangementSchema,
  participantList: z.array(ParticipantSchema).refine(
    (pList) => {
      const hasDisabled = pList.filter((x) => x.disabled === 'true')
      return hasDisabled.length === 0
    },
    {
      message:
        'Vinsamlegast fjarlægðu ógjaldgenga notendur áður en haldið er áfram',
    },
  ),
  participantCsvError: z.boolean().optional(),
  participantValidityError: z.boolean().optional(),
})
