export type AddToCartDTO = {
  productId: string
  quantity: number
  size?: string
  toppings?: string[]
  unitPrice?: number
}

export type CartItem = {
  productId: string
  name: string
  unitPrice: number
  stock: number
  quantity: number
  imageUrl: string | null
  size?: string
  toppings?: string[]
}

export type CartActionResult = {
  success: boolean
  message: string
}
