export type AddToCartDTO = {
  productId: string
  quantity: number
}

export type CartItem = {
  productId: string
  name: string
  unitPrice: number
  stock: number
  quantity: number
  imageUrl: string | null
}

export type CartActionResult = {
  success: boolean
  message: string
}
