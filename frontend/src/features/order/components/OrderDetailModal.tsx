'use client'

import React from 'react'
import type { OrderDetail, OrderStatus } from '../types'
import { formatCurrency } from './OrderItemCard'

interface OrderDetailModalProps {
  order: OrderDetail
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (nextStatus: OrderStatus) => Promise<boolean>
  isUpdating?: boolean
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; text: string; border: string; label: string; icon: string }
> = {
  PENDING: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    label: 'Chờ thanh toán',
    icon: '⏳',
  },
  PAID: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    label: 'Đã thanh toán (Chờ Barista)',
    icon: '💳',
  },
  PREPARING: {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    label: 'Đang pha chế',
    icon: '☕',
  },
  READY: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    label: 'Mời tới quầy lấy nước',
    icon: '🔔',
  },
  COMPLETED: {
    bg: 'bg-stone-50',
    text: 'text-stone-800',
    border: 'border-stone-200',
    label: 'Đã hoàn tất',
    icon: '✅',
  },
  PAYMENT_FAILED: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    label: 'Thanh toán lỗi (Có thể thử lại)',
    icon: '❌',
  },
  CANCELLED: {
    bg: 'bg-stone-50',
    text: 'text-stone-500',
    border: 'border-stone-200',
    label: 'Đã hủy đơn',
    icon: '🚫',
  },
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating = false,
}) => {
  if (!isOpen) return null

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>🧾</span> Chi tiết đơn & Tiến độ tại quầy
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">Mã đơn: #{order.id}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Trạng thái hiện tại & Demo State Machine */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 font-medium">Trạng thái (Quy chuẩn Mục 9.1)</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  <span>{statusConfig.icon}</span>
                  {order.status} — {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Quick State Transition Actions following Section 9.1 */}
            {onStatusChange && (
              <div className="pt-2 border-t border-stone-200/60">
                <p className="text-[11px] text-stone-500 mb-2 font-medium">
                  Chuyển tiếp trạng thái (State Machine Transitions):
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => onStatusChange('PAID')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                      >
                        Thanh toán thành công (PAID)
                      </button>
                      <button
                        onClick={() => onStatusChange('PAYMENT_FAILED')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-50"
                      >
                        Thanh toán lỗi (PAYMENT_FAILED)
                      </button>
                      <button
                        onClick={() => onStatusChange('CANCELLED')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold disabled:opacity-50"
                      >
                        Hủy đơn (CANCELLED)
                      </button>
                    </>
                  )}

                  {order.status === 'PAYMENT_FAILED' && (
                    <>
                      <button
                        onClick={() => onStatusChange('PAID')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                      >
                        Thử lại thanh toán (PAID)
                      </button>
                      <button
                        onClick={() => onStatusChange('CANCELLED')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold disabled:opacity-50"
                      >
                        Hủy đơn (CANCELLED)
                      </button>
                    </>
                  )}

                  {order.status === 'PAID' && (
                    <button
                      onClick={() => onStatusChange('PREPARING')}
                      disabled={isUpdating}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                    >
                      Barista nhận pha chế (PREPARING)
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <>
                      <button
                        onClick={() => onStatusChange('READY')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                      >
                        Pha xong $\to$ Mời tới quầy (READY)
                      </button>
                      <button
                        onClick={() => onStatusChange('CANCELLED')}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold disabled:opacity-50"
                      >
                        Hủy đơn (CANCELLED)
                      </button>
                    </>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => onStatusChange('COMPLETED')}
                      disabled={isUpdating}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                    >
                      Khách đã nhận nước (COMPLETED)
                    </button>
                  )}

                  {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                    <span className="text-xs text-stone-400 italic">
                      Trạng thái kết thúc (Terminal State) — không thể chuyển tiếp.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Thông tin khách hàng & Bàn/Quầy */}
          {order.customerInfo && (
            <div className="text-xs space-y-1.5 p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
              <p className="font-bold text-stone-900 text-sm">📍 Thông tin nhận tại quầy</p>
              <p className="text-stone-700 font-medium">
                Khách hàng: {order.customerInfo.customerName} • {order.customerInfo.customerPhone}
              </p>
              <p className="text-stone-600">
                Hình thức:{' '}
                {order.customerInfo.pickupType === 'DINE_IN'
                  ? `Dùng tại quán (${order.customerInfo.tableNumber || 'Bàn chưa ghi'})`
                  : 'Mang đi (Take-away nhận tại quầy)'}
              </p>
              {order.customerInfo.note && (
                <p className="italic text-stone-500">Ghi chú: {order.customerInfo.note}</p>
              )}
            </div>
          )}

          {/* Danh sách món */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Đồ uống đã đặt ({order.items.length})
            </h4>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-stone-800">
                      {item.product?.name || `Sản phẩm #${item.productId}`}
                    </p>
                    <p className="text-xs text-stone-400">
                      {formatCurrency(item.unitPrice)} &times; {item.quantity}
                      {item.size ? ` (Size ${item.size})` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-amber-900">{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="font-bold text-stone-900">Tổng thanh toán:</span>
              <span className="text-lg font-extrabold text-amber-900">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-semibold text-xs text-stone-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
