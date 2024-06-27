import {
  DateType,
  DefenderChoice,
  Gender,
  Institution,
  User,
} from '@island.is/judicial-system/types'

export class InternalCaseResponse {
  id!: string
  courtCaseNumber!: string
  defendants!: Defendant[]
  court!: Institution
  judge!: User
  prosecutorsOffice!: Institution
  prosecutor!: User
  dateLogs?: DateLog[]
}

interface Defendant {
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  defenderChoice?: DefenderChoice
  acceptCompensationClaim?: boolean
}

interface DateLog {
  id: string
  created: Date
  dateType: DateType
  date: Date
  location?: string
}
