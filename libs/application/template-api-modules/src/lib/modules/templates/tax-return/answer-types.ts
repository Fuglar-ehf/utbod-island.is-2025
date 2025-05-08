export interface NationalIdWithName {
  name: string
  nationalId: string
}

export interface SalaryItem {
  input: string
  nationalIdWithName: NationalIdWithName
}

export interface CarItem {
  amount: string
  year: string
  licence: string
}
