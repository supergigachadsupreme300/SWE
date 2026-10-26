'use client'

import React from 'react'
import { useAddToCart } from '../hooks'
import type { ProductDetail } from '../types'
import { QuantitySelector } from './QuantitySelector'

type AddToCartButtonProps = {
  product: ProductDetail
}

const SIZE_OPTIONS = [
  { value: 'S', label: 'S', delta: -5000 },
  { value: 'M', label: 'M', delta: 0 },
  { value: 'L', label: 'L', delta: 10000 },
]

const TOPPING_OPTIONS = [
  { value: 'pearl', label: 'Trân châu', price: 8000 },
  { value: 'cream', label: 'Kem', price: 10000 },
  { value: 'caramel', label: 'Sốt caramel', price: 7000 },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND'
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const soldOut = product.stock <= 0
  const [quantity, setQuantity] = React.useState(1)
  const [size, setSize] = React.useState('M')
  const [toppings, setToppings] = React.useState<string[]>([])
  const { addToCart, status, message } = useAddToCart()

  const pending = status === 'pending'

  const sizeDelta = SIZE_OPTIONS.find((option) => option.value === size)?.delta ?? 0
  const toppingPrice = toppings.reduce((total, value) => {
    const option = TOPPING_OPTIONS.find((item) => item.value === value)
    return total + (option?.price ?? 0)
  }, 0)
  const unitPrice = product.price + sizeDelta + toppingPrice

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void addToCart({
      productId: product.id,
      quantity,
      size,
      toppings,
      unitPrice,
    })
  }

  const toggleTopping = (value: string) => {
    setToppings((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-900">Size</p>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSize(option.value)}
              disabled={soldOut || pending}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                size === option.value
                  ? 'border-amber-600 bg-amber-50 text-amber-700'
                  : 'border-gray-300 text-gray-700 hover:border-amber-400'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-900">Topping</p>
        <div className="flex flex-wrap gap-2">
          {TOPPING_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTopping(option.value)}
              disabled={soldOut || pending}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                toppings.includes(option.value)
                  ? 'border-amber-600 bg-amber-50 text-amber-700'
                  : 'border-gray-300 text-gray-700 hover:border-amber-400'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {option.label} (+{formatPrice(option.price)})
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-3 text-sm">
        <p>Đơn giá: {formatPrice(unitPrice)}</p>
        <p>Tổng: {formatPrice(unitPrice * quantity)}</p>
      </div>

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