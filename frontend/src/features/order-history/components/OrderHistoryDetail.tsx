'use client'

import Link from 'next/link'
import type { OrderDetail } from '../../order/types'
import { formatCurrency } from '../../order/components/OrderItemCard'
import { formatOrderDate, ORDER_STATUS_LABELS, statusClass } from './orderHistoryUtils'

export function OrderHistoryDetail({ order }: { order: OrderDetail }) {
  const itemsTotal = order.items.reduce((sum, item) => sum + item.lineTotal, 0)

  return (
    <div className="min-h-screen bg-[#FBF9F5] px-4 pb-16 pt-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/orders" className="text-sm font-bold text-amber-900 hover:text-amber-700">← Quay lại lịch sử đơn hàng</Link>

        <header className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Chi tiết đơn hàng</p>
              <h1 className="mt-2 break-all text-2xl font-black sm:text-3xl">#{order.id}</h1>
              <p className="mt-2 text-sm text-stone-500">Đặt lúc {formatOrderDate(order.createdAt)}</p>
            </div>
            <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-sm font-bold ${statusClass(order.status)}`}>
              {ORDER_STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <div className="mt-7 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Hình thức nhận</p>
              <p className="mt-1 font-semibold text-stone-800">
                {order.customerInfo?.pickupType === 'DINE_IN'
                  ? 'Dùng tại quán'
                  : order.customerInfo?.pickupType === 'AT_COUNTER'
                    ? 'Nhận tại quầy'
                    : 'Chưa có thông tin'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Người nhận</p>
              <p className="mt-1 font-semibold text-stone-800">{order.customerInfo?.customerName || 'Chưa có thông tin'}</p>
              {order.customerInfo?.customerPhone && <p className="mt-1 text-sm text-stone-500">{order.customerInfo.customerPhone}</p>}
            </div>
            {order.customerInfo?.tableNumber && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Số bàn</p>
                <p className="mt-1 font-semibold">{order.customerInfo.tableNumber}</p>
              </div>
            )}
            {order.customerInfo?.note && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Ghi chú</p>
                <p className="mt-1 text-sm text-stone-700">{order.customerInfo.note}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Phương thức thanh toán</p>
              <p className="mt-1 font-semibold text-stone-800">
                {order.paymentMethod === 'MOMO' ? 'MoMo' : order.paymentMethod === 'CARD' ? 'Thẻ' : order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Chưa chọn'}
              </p>
            </div>
          </div>
        </header>

        {(order.status === 'PENDING' || order.status === 'PAYMENT_FAILED') && (
          <div className="mt-5">
            <Link
              href={`/payment?orderId=${order.id}`}
              className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Thanh toán đơn hàng
            </Link>
          </div>
        )}

        <section className="mt-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-extrabold">Sản phẩm trong đơn</h2>
          <div className="mt-4 divide-y divide-stone-100">
            {order.items.map((item) => {
              const name = item.product?.name || `Sản phẩm ${item.productId}`
              const imageUrl = item.product?.imageUrl
              return (
                <div key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-100 bg-amber-50">
                    {imageUrl ? (
                      // Plain img keeps this feature independent of Next image configuration.
                      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">☕</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-900">{name}</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {item.size ? `Size ${item.size} · ` : ''}{formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-amber-950">{formatCurrency(item.lineTotal)}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 space-y-3 border-t border-stone-100 pt-5">
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Tạm tính sản phẩm</span>
              <span>{formatCurrency(itemsTotal)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="font-bold text-stone-900">Tổng đơn hàng</span>
              <span className="text-2xl font-black text-amber-950">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
