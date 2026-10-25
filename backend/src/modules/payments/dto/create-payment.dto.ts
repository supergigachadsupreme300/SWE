
import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string

  @IsString()
  @IsIn(['WALLET', 'CARD'])
  method!: string

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string
}
