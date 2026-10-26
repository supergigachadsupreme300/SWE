import { IsIn, IsOptional, IsString } from 'class-validator'

export type ValidOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'

export class UpdateOrderStatusDto {
  @IsIn([
    'PENDING',
    'PAID',
    'PREPARING',
    'READY',
    'COMPLETED',
    'PAYMENT_FAILED',
    'CANCELLED',
  ])
  status!: ValidOrderStatus

  @IsOptional()
  @IsString()
  reason?: string
}