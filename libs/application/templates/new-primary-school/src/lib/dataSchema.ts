import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { RelationOptions } from './constants'
import { errorMessages } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  childsNationalId: z.string().min(1),
  relatives: z
    .array(
      z.object({
        fullName: z.string().min(1),
        phoneNumber: z.string().refine(
          (p) => {
            const phoneNumber = parsePhoneNumberFromString(p, 'IS')
            const phoneNumberStartStr = ['6', '7', '8']
            return (
              phoneNumber &&
              phoneNumber.isValid() &&
              phoneNumberStartStr.some((substr) =>
                phoneNumber.nationalNumber.startsWith(substr),
              )
            )
          },
          { params: errorMessages.phoneNumber },
        ),
        nationalId: z.string().refine((n) => kennitala.isValid(n), {
          params: errorMessages.nationalId,
        }),
        relation: z.enum([
          RelationOptions.GRANDPARENTS,
          RelationOptions.SIBLINGS,
          RelationOptions.STEP_PARENT,
          RelationOptions.RELATIVES,
          RelationOptions.FRIENDS_AND_OTHER,
        ]),
      }),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.relativesRequired,
    }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
