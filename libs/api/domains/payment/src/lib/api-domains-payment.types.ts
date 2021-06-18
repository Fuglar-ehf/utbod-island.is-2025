export interface ChargeResult {
  success: boolean
  error: Error | null
  data?: {
    paymentUrl: string
    user4: string
    receptionID: string
  }
}

export interface CallbackResult {
  success: boolean
  error: Error | null | string
  data?: Callback
}

export interface Callback {
  receptionID: string
  chargeItemSubject: string
  status: 'paid' | 'cancelled' | 'recreated' | 'recreatedAndPaid'
}

export interface PaymentServiceOptions {
  xRoadPath: string
  xRoadClientId: string
  username: string
  password: string
  callbackBaseUrl: string
  callbackAdditionUrl: string
  arkBaseUrl: string
}
