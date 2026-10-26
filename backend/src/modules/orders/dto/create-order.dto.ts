import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateOrderItemDto {
  @IsString()
  productId!: string

  @IsInt()
  @Min(1)
  quantity!: number

  @IsOptional()
  @IsString()
  size?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  toppings?: string[]

  @IsNumber()
  unitPrice!: number

  @IsOptional()
  @IsNumber()
  lineTotal?: number
}

export class CustomerPickupInfoDto {
  @IsString()
  customerName!: string

  @IsString()
  customerPhone!: string

  @IsOptional()
  @IsIn(['AT_COUNTER', 'DINE_IN'])
  pickupType?: 'AT_COUNTER' | 'DINE_IN'

  @IsOptional()
  @IsString()
  tableNumber?: string

  @IsOptional()
  @IsString()
  note?: string
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[]

  @IsNumber()
  total!: number

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerPickupInfoDto)
  customerInfo?: CustomerPickupInfoDto

  @IsOptional()
  @IsString()
  paymentMethod?: string
}