export interface NationalIdWithName {
  name: string
  nationalId: string
}

export interface SalaryItem {
  input: string
  nationalIdWithName: NationalIdWithName
}
