'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { OrderDetail } from '../types'
import { formatCurrency } from './OrderItemCard'

interface OrderConfirmationProps {
  order: OrderDetail
  onContinueShopping?: () => void
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onContinueShopping,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyOrderId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden animate-fadeIn">
      {/* Top Banner - Order Success */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-white p-8 text-center relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 border border-white/20 shadow-inner">
          ✓
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">Tạo đơn hàng thành công!</h2>
        <p className="text-amber-200/90 text-sm mt-1">
          Đơn hàng của bạn đã được ghi nhận trên hệ thống BrewLite.
        </p>

        {/* Mã đơn hàng */}
        <div className="mt-5 inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/15 text-xs">
          <span className="text-amber-200">Mã đơn hàng:</span>
          <span className="font-mono font-extrabold text-base text-amber-300 tracking-wider">
            {order.id}
          </span>
          <button
            onClick={handleCopyOrderId}
            type="button"
            className="ml-2 text-[11px] bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors font-medium"
          >
            {copied ? 'Đã sao chép!' : 'Sao chép'}
          </button>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Trạng thái đơn khởi tạo */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
              Trạng thái đơn hàng
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                ⏳ {order.status} (Đã ghi nhận)
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-stone-400">Thời gian tạo</p>
            <p className="text-xs font-medium text-stone-700 mt-0.5">
              {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Thông tin khách hàng & Hình thức */}
        {order.customerInfo && (
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-1.5 text-xs text-stone-600">
            <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span>👤</span> Thông tin khách hàng
            </p>
            <p>
              Khách hàng: <strong className="text-stone-900">{order.customerInfo.customerName}</strong> ({order.customerInfo.customerPhone})
            </p>
            <p>
              Hình thức:{' '}
              <span className="font-semibold text-amber-900">
                {order.customerInfo.pickupType === 'DINE_IN'
                  ? `Dùng tại quán (${order.customerInfo.tableNumber || 'Bàn chưa ghi'})`
                  : 'Mang đi (Take-away)'}
              </span>
            </p>
            {order.customerInfo.note && (
              <p className="italic text-stone-500">Ghi chú: &ldquo;{order.customerInfo.note}&rdquo;</p>
            )}
          </div>
        )}

        {/* Danh sách các món trong OrderItem */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Chi tiết các món ({order.items?.length || 0})
          </h4>
          <div className="divide-y divide-stone-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-stone-800 font-medium">
                    {item.product?.name || `Sản phẩm #${item.productId}`}
                  </span>
                  {item.size && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                      Size {item.size}
                    </span>
                  )}
                  <span className="text-xs text-stone-400">&times; {item.quantity}</span>
                </div>
                <span className="font-semibold text-stone-900">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-stone-900">Tổng thanh toán</span>
            <span className="text-lg font-extrabold text-amber-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Bridge to Member 6 Payment & Order New */}
        <div className="pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/payment?orderId=${order.id}&amount=${order.total}`}
              className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-semibold text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Tiến hành thanh toán</span>
              <span>→</span>
            </Link>

            <button
              type="button"
              onClick={() => (onContinueShopping ? onContinueShopping() : (window.location.href = '/'))}
              className="py-3.5 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-colors text-center"
            >
              ← Đặt thêm đơn
            </button>
          </div>

          <p className="text-[11px] text-stone-400 text-center italic">
            💡 Giao diện cổng thanh toán (QR MoMo/VietQR) được xử lý bởi Thành viên 6 (Module Payment).
          </p>
        </div>
      </div>
    </div>
  )
}
