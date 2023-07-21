import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  HouseholdSupplementHousing,
  NO,
  TaxLevelOptions,
  YES,
} from './constants'
import { errorMessages } from './messages'
import addYears from 'date-fns/addYears'
import { formatBankInfo } from './oldAgePensionUtils'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationType: z.object({
    option: z.enum([
      ApplicationType.OLD_AGE_PENSION,
      ApplicationType.HALF_OLD_AGE_PENSION,
      ApplicationType.SAILOR_PENSION,
    ]),
  }),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
  }),
  applicantInfo: z.object({
    email: z.string().email(),
    phonenumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        const phoneNumberStartStr = ['6', '7', '8']
        return (
          phoneNumber &&
          phoneNumber.isValid() &&
          (phoneNumber.country === 'IS'
            ? phoneNumberStartStr.some((substr) =>
                phoneNumber.nationalNumber.startsWith(substr),
              )
            : true)
        )
      },
      { params: errorMessages.phoneNumber },
    ),
  }),
  residenceHistory: z.object({
    question: z.enum([YES, NO]),
  }),
  period: z
    .object({
      year: z.string(),
      month: z.string(),
    })
    .refine(
      (p) => {
        const today = new Date()
        const startDate = addYears(today, -2)
        const selectedDate = new Date(p.year + p.month)
        return startDate < selectedDate
      },
      { params: errorMessages.period },
    ),
  onePaymentPerYear: z.object({
    question: z.enum([YES, NO]),
  }),
  householdSupplement: z.object({
    housing: z.enum([
      HouseholdSupplementHousing.HOUSEOWNER,
      HouseholdSupplementHousing.RENTER,
    ]),
    children: z.enum([YES, NO]),
  }),
  paymentInfo: z.object({
    bank: z.string().refine(
      (b) => {
        const bankAccount = formatBankInfo(b)
        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: errorMessages.bank },
    ),
    spouseAllowance: z.enum([YES, NO]),
    spouseAllownaceUsage: z.string().optional(),
    personalAllowance: z.enum([YES, NO]),
    personalAllowanceUsage: z.string().optional(),
    taxLevel: z.enum([
      TaxLevelOptions.INCOME,
      TaxLevelOptions.FIRST_LEVEL,
      TaxLevelOptions.SECOND_LEVEL,
    ]),
  }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
