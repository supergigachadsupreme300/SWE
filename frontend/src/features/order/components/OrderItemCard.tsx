'use client'

import React from 'react'
import type { OrderItem } from '../types'

interface OrderItemCardProps {
  item: OrderItem
  readOnly?: boolean
  onQuantityChange?: (delta: number) => void
  onRemove?: () => void
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  readOnly = false,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-stone-200/80 last:border-b-0 hover:bg-stone-50/60 transition-colors rounded-xl px-2">
      {/* Product Image / Icon */}
      <div className="relative w-13 h-13 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200/60 flex items-center justify-center shrink-0 border border-amber-200/50 shadow-xs">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl" role="img" aria-label="Coffee">
            ☕
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-stone-900 truncate">
            {item.name}
          </h4>
          <span className="text-sm font-bold text-amber-900 whitespace-nowrap">
            {formatCurrency(item.lineTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            {item.size && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 text-[11px]">
                Size {item.size}
              </span>
            )}
            <span>{formatCurrency(item.price)}/món</span>
          </div>

          {/* Quantity Controls / Actions (Review & Edit mode) */}
          {!readOnly && onQuantityChange ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => onQuantityChange(-1)}
                  disabled={item.quantity <= 1}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Giảm số lượng"
                >
                  -
                </button>
                <span className="px-2 text-xs font-bold text-stone-900 min-w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(1)}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-200 transition-colors"
                  title="Tăng số lượng"
                >
                  +
                </button>
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs"
                  title="Xóa món này"
                >
                  🗑️
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs font-medium text-stone-500">
              &times; {item.quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
