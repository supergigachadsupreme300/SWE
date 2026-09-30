export type OrderCreate = {
  items: { productId: string; quantity: number }[]
  total: number
}
