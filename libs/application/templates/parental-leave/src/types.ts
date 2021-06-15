import { YES, NO } from './constants'

export type Boolean = typeof NO | typeof YES

export interface Period {
  startDate: string
  endDate: string
  ratio: string
  duration: string
}

export interface Payment {
  date: string
  taxAmount: number
  pensionAmount: number
  estimatedAmount: number
  privatePensionAmount: number
  unionAmount: number
  estimatePayment: number
  period: {
    from: string
    to: string
    ratio: number
    approved: boolean
    paid: boolean
  }
}
