'use client'

import React from 'react'
import Link from 'next/link'
import { ProductDetailCard, useProductDetail } from '../../../features/product-detail'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { product, relatedProducts, loading, error, reload } = useProductDetail(params.id)

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:text-amber-700">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product?.name ?? 'Detail'}</span>
      </nav>

      <ProductDetailCard
        product={product}
        relatedProducts={relatedProducts}
        loading={loading}
        error={error}
        onRetry={reload}
      />
    </div>
  )
}
