import React from 'react'
import type { RelatedProduct } from '../types'
import { formatPrice } from '../utils/formatPrice'

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  if (!products.length) return null

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">You may also like</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <a
              href={`/products/${product.id}`}
              className="group block h-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800">{product.name}</p>
              <p className="text-sm font-semibold text-amber-700">{formatPrice(product.price)}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
