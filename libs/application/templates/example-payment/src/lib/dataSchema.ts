import * as z from 'zod'

export const dataSchema = z.object({
  userSelectedChargeItemCode: z.string().nonempty(),
})
