import { apiGet } from '../../../services/api'
import type { ProductDetail, RelatedProduct } from '../types'
import { normalizeProductDetail, normalizeRelatedProducts } from './normalize'

export class ProductDetailNotFoundError extends Error {
  constructor(id: string) {
    super(`Product "${id}" was not found`)
    this.name = 'ProductDetailNotFoundError'
  }
}

export async function fetchProductDetail(id: string): Promise<ProductDetail> {
  try {
    return normalizeProductDetail(await apiGet(`/products/${encodeURIComponent(id)}`), id)
  } catch (error) {
    throw error
  }
}

export async function fetchRelatedProducts(id: string, limit = 4): Promise<RelatedProduct[]> {
  try {
    const related = normalizeRelatedProducts(
      await apiGet(`/products/${encodeURIComponent(id)}/related?limit=${limit}`),
    )
    return related
  } catch (error) {
    throw error
  }
}
