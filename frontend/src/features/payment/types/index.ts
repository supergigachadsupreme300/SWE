
export type PaymentMethod = 'WALLET' | 'CARD'

export type PaymentPayload = {
  orderId: string
  method: PaymentMethod
  idempotencyKey: string
}

export type PaymentResult = {
  paymentId: string
  orderId: string
  amount: number
  method: PaymentMethod
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING'
  orderStatus: string
  message: string
}
