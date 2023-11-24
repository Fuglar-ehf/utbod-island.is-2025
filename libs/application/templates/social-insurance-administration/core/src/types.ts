export interface BankInfo {
  bank?: string
  ledger?: string
  accountNumber?: string
  iban?: string
  swift?: string
  foreignBankName?: string
  foreignBankAddress?: string
  currency?: string
}

export interface ApplicantInfo {
  bankAccount?: BankInfo
  phoneNumber?: string
  emailAddress?: string
}
