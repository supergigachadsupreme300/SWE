import React from 'react'
import type { ProductDetail } from '../types'
import { formatPrice } from '../utils/formatPrice'
import { StockBadge } from './StockBadge'

export function ProductInfo({ product }: { product: ProductDetail }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {product.brand || product.category ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            {[product.brand, product.category].filter(Boolean).join(' / ')}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
      </div>

      <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>

      <StockBadge stock={product.stock} />

      {product.description ? (
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{product.description}</p>
      ) : (
        <p className="text-sm italic text-gray-400">No description provided for this product.</p>
      )}
    </div>
  )
}
