export class CreateOrderItemDto {
  productId: string
  quantity: number
  size?: string
  unitPrice: number
  lineTotal?: number
}

export class CustomerPickupInfoDto {
  customerName: string
  customerPhone: string
  pickupType?: 'AT_COUNTER' | 'DINE_IN'
  tableNumber?: string
  note?: string
}

export class CreateOrderDto {
  userId?: string
  items: CreateOrderItemDto[]
  total: number
  customerInfo?: CustomerPickupInfoDto
  paymentMethod?: string
}
