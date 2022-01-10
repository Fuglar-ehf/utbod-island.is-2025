import { error } from './messages/index'
import * as z from 'zod'
import { isValidEmail } from './utils'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  spouse: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    approveTerms: z.boolean().refine((v) => v, {
      params: error.validation.approveSpouse,
    }),
  }),
})

export type answersSchema = z.infer<typeof dataSchema>
