export interface TaxReturnData {
  income: IncomeInfo[]
  cars: CarInfo[]
  realestates: RealestateInfo[]
  loans: Loan[]
  benefits: Benefit[]
}

export interface IncomeInfo {
  employer: string
  employerNationalId: string
  income: number
}

export interface CarInfo {
  yearBought: number
  amount: number
  registrationNumber: string
}

export interface RealestateInfo {
  address: string
  registrationNumber: string
  realastateValue: number
}

export interface Loan {
  yearBought: number
  date: Date
  principal: number
  interest: number
  remaining: number
  address: string
  loanId: string
  // Years
  periodOfLoan: number
  // Name of bank
  loanProvider: string
  // National ID of bank
  loanProviderNationalId: string
}

export interface Benefit {
  from: string
  amount: number
  name: string
  typeOfBenefit: string
}

export interface NameValuePair {
  name: string
  value: string
}
