'use client'

import React from 'react'
import { useAddToCart } from '../hooks'
import type { ProductDetail } from '../types'
import { QuantitySelector } from './QuantitySelector'

type AddToCartButtonProps = {
  product: ProductDetail
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const soldOut = product.stock <= 0
  const [quantity, setQuantity] = React.useState(1)
  const { addToCart, status, message } = useAddToCart()

  const pending = status === 'pending'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void addToCart({ productId: product.id, quantity })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector
          value={quantity}
          max={Math.max(1, product.stock)}
          onChange={setQuantity}
          disabled={soldOut || pending}
        />
        <button
          type="submit"
          disabled={soldOut || pending}
          className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {soldOut ? 'Out of stock' : pending ? 'Adding...' : 'Add to cart'}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={`text-xs ${
            status === 'error'
              ? 'text-red-600'
              : status === 'success'
                ? 'text-emerald-700'
                : 'text-gray-500'
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}
