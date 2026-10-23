import Link from 'next/link'
import type { OrderDetail } from '../../order/types'
import { formatCurrency } from '../../order/components/OrderItemCard'
import { formatOrderDate, ORDER_STATUS_LABELS, statusClass } from './orderHistoryUtils'

export function OrderHistoryCard({ order }: { order: OrderDetail }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Mã đơn hàng</p>
          <h2 className="mt-1 break-all text-lg font-extrabold text-stone-900">#{order.id}</h2>
          <p className="mt-1 text-sm text-stone-500">{formatOrderDate(order.createdAt)}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusClass(order.status)}`}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-stone-100 pt-4">
        <div>
          <p className="text-sm text-stone-500">{itemCount} sản phẩm</p>
          <p className="mt-1 text-xl font-extrabold text-amber-950">{formatCurrency(order.total)}</p>
        </div>
        <Link
          href={`/orders/${encodeURIComponent(order.id)}`}
          className="inline-flex items-center justify-center rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
        >
          Xem chi tiết <span className="ml-2" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
