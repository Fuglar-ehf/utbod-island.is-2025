export interface TaxReturnData {
  income: IncomeInfo[]
  cars: CarInfo[]
  realestates: RealestateInfo[]
  mortgages: Mortgage[]
  otherLoans: OtherLoan[]
  allowances: Allowance[]
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

export interface Mortgage {
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

export interface OtherLoan {
  description: string
  interest: number
  remaining: number
}

export interface Benefit {
  from: string
  amount: number
  name: string
}

export interface Allowance {
  from: string
  amount: number
  name: string
}

export interface UserInfo {
  nationalId: string
  name: string
  address: string
  email: string
  phoneNumber: string
}
