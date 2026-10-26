/**
 * Types & Domain Models for BrewLite Order & Checkout Flow
 * Feature: features/order
 * Role: Member 5 (Order & Checkout)
 * Standard: BrewLite Canteen / Counter Pickup Specification
 */

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'

export type CoffeeSize = 'S' | 'M' | 'L'

export type PaymentMethod = 'MOMO' | 'CARD' | 'BANK_TRANSFER'

export type PickupType = 'AT_COUNTER' | 'DINE_IN'

export interface OrderItem {
  productId: string
  name: string
  imageUrl?: string
  price: number
  quantity: number
  size?: CoffeeSize | string
  toppings?: string[]
  lineTotal: number
}

export interface OrderItemPayload {
  productId: string
  quantity: number
  size?: string
  toppings?: string[]
  unitPrice: number
  lineTotal: number
}

export interface CustomerPickupInfo {
  customerName: string
  customerPhone: string
  pickupType: PickupType
  tableNumber?: string
  note?: string
}

export interface OrderCreatePayload {
  items: OrderItemPayload[]
  total: number
  customerInfo: CustomerPickupInfo
  paymentMethod?: PaymentMethod
  userId?: string
}

export interface OrderItemDetail {
  id: string
  orderId: string
  productId: string
  quantity: number
  size?: string | null
  toppings?: string | null
  unitPrice: number
  lineTotal: number
  product?: {
    id: string
    name: string
    imageUrl?: string | null
    price: number
  }
}

export interface OrderDetail {
  id: string
  userId: string
  total: number
  status: OrderStatus
  customerInfo?: CustomerPickupInfo | null
  items: OrderItemDetail[]
  createdAt: string
  updatedAt: string
}

export interface CheckoutFormErrors {
  customerName?: string
  customerPhone?: string
  tableNumber?: string
  general?: string
}

export type CheckoutStep = 'customer_info' | 'payment' | 'confirmed'
