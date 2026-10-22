export type ValidOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'

export class UpdateOrderStatusDto {
  status: ValidOrderStatus
  reason?: string
}
