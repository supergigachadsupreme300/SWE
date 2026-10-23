'use client'

import type { OrderStatus } from '../../order/types'
import { ORDER_STATUS_LABELS } from './orderHistoryUtils'

const statuses: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PREPARING',
  'READY',
  'COMPLETED',
  'PAYMENT_FAILED',
  'CANCELLED',
]

interface Props {
  keyword: string
  status: OrderStatus | 'ALL'
  onKeywordChange: (value: string) => void
  onStatusChange: (value: OrderStatus | 'ALL') => void
}

export function OrderHistoryFilters({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_240px]">
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500">Tìm theo mã đơn</span>
        <input
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Ví dụ: BL-1234"
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500">Trạng thái</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as OrderStatus | 'ALL')}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-100"
        >
          <option value="ALL">Tất cả trạng thái</option>
          {statuses.map((value) => (
            <option key={value} value={value}>{ORDER_STATUS_LABELS[value]}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
