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
    <div className="flex items-center gap-2.5 py-2 px-1 border-b border-stone-100 last:border-b-0 hover:bg-stone-50/70 transition-colors rounded-lg">
      {/* Product Image / Icon - Compact 10x10 */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200/60 flex items-center justify-center shrink-0 border border-amber-200/50 shadow-2xs">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg" role="img" aria-label="Coffee">
            ☕
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
            {item.name}
          </h4>
          <span className="text-xs sm:text-sm font-bold text-amber-900 whitespace-nowrap">
            {formatCurrency(item.lineTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            {item.size && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px]">
                Size {item.size}
              </span>
            )}
            <span>{formatCurrency(item.price)}</span>
          </div>

          {/* Compact Quantity Controls */}
          {!readOnly && onQuantityChange ? (
            <div className="flex items-center gap-1">
              <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => onQuantityChange(-1)}
                  disabled={item.quantity <= 1}
                  className="w-5 h-5 flex items-center justify-center text-[11px] font-bold text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Giảm"
                >
                  -
                </button>
                <span className="px-1 text-[11px] font-bold text-stone-900 min-w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(1)}
                  className="w-5 h-5 flex items-center justify-center text-[11px] font-bold text-stone-600 hover:bg-stone-200 transition-colors"
                  title="Tăng"
                >
                  +
                </button>
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="w-5 h-5 flex items-center justify-center rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-[11px]"
                  title="Xóa món"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs font-semibold text-stone-500">
              &times; {item.quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
