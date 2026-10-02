import type { ProductSummary } from '../../product/types'

export type ProductDetail = {
  id: string
  name: string
  description?: string | null
  price: number
  images: string[]
  stock: number
  category?: string | null
  brand?: string | null
  createdAt?: string
}

export type RelatedProduct = ProductSummary & {
  imageUrl?: string | null
}

export type StockState = 'in-stock' | 'low-stock' | 'out-of-stock'

export type AddToCartRequest = {
  productId: string
  quantity: number
}

export type AddToCartStatus = 'idle' | 'pending' | 'success' | 'unavailable' | 'error'

export type CartBridge = {
  addToCart: (item: AddToCartRequest) => void | Promise<void>
}

export type UseProductDetailOptions = {
  relatedLimit?: number
}

export type UseProductDetailResult = {
  product: ProductDetail | null
  relatedProducts: RelatedProduct[]
  loading: boolean
  error: string | null
  reload: () => void
}

export type UseAddToCartResult = {
  addToCart: (item: AddToCartRequest) => Promise<void>
  status: AddToCartStatus
  message: string | null
  connected: boolean
  reset: () => void
}

export const LOW_STOCK_THRESHOLD = 5

declare global {
  interface Window {
    __BREWLITE_CART__?: CartBridge
  }
}
