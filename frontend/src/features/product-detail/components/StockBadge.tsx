import React from 'react'
import { getStockState } from '../services'
import type { StockState } from '../types'

const STOCK_LABELS: Record<StockState, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
}

const STOCK_CLASSES: Record<StockState, string> = {
  'in-stock': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'low-stock': 'bg-amber-50 text-amber-700 border-amber-200',
  'out-of-stock': 'bg-red-50 text-red-700 border-red-200',
}

export function StockBadge({ stock }: { stock: number }) {
  const state = getStockState(stock)
  const label = STOCK_LABELS[state]
  const detail = state === 'out-of-stock' ? label : `${label} - ${stock} left`

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${STOCK_CLASSES[state]}`}>
      {detail}
    </span>
  )
}
