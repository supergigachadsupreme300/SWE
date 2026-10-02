'use client'

import React from 'react'
import type { ProductDetail, RelatedProduct } from '../types'
import { AddToCartButton } from './AddToCartButton'
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'
import { RelatedProducts } from './RelatedProducts'

type ProductDetailCardProps = {
  product: ProductDetail | null
  relatedProducts?: RelatedProduct[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

function LoadingState() {
  return (
    <div className="grid gap-8 md:grid-cols-2" aria-busy="true" aria-label="Loading product">
      <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
      <div className="flex flex-col gap-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h1 className="text-lg font-semibold text-red-800">Product unavailable</h1>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function ProductDetailCard({ product, relatedProducts = [], loading, error, onRetry }: ProductDetailCardProps) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (!product) return <ErrorState message="This product does not exist." onRetry={onRetry} />

  return (
    <div className="flex flex-col">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />
        <div className="flex flex-col gap-6">
          <ProductInfo product={product} />
          <AddToCartButton product={product} />
        </div>
      </div>
      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
