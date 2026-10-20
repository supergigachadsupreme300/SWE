'use client'

import React, { useState } from 'react'
import type { OrderItem } from '../types'
import { OrderItemCard, formatCurrency } from './OrderItemCard'

interface OrderSummaryProps {
  items: OrderItem[]
  subtotal: number
  shippingFee?: number
  discount?: number
  onApplyPromo?: (code: string) => void
  onUpdateQuantity?: (productId: string, size: string | undefined, delta: number) => void
  onRemoveItem?: (productId: string, size: string | undefined) => void
  onAddQuickItem?: (item: OrderItem) => void
}

const QUICK_ADD_DRINKS: OrderItem[] = [
  {
    productId: 'prod_muoi_03',
    name: 'Cà Phê Muối Kem Béo',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80',
    price: 39000,
    quantity: 1,
    size: 'M',
    lineTotal: 39000,
  },
  {
    productId: 'prod_bacxiu_04',
    name: 'Bạc Xỉu Sữa Tươi 3 Tầng',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=150&auto=format&fit=crop&q=80',
    price: 35000,
    quantity: 1,
    size: 'M',
    lineTotal: 35000,
  },
  {
    productId: 'prod_tradao_05',
    name: 'Trà Đào Cam Sả Tươi',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=150&auto=format&fit=crop&q=80',
    price: 42000,
    quantity: 1,
    size: 'L',
    lineTotal: 42000,
  },
]

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  discount = 0,
  onApplyPromo,
  onUpdateQuantity,
  onRemoveItem,
  onAddQuickItem,
}) => {
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const total = Math.max(0, subtotal - discount)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    if (promoInput.toUpperCase() === 'BREWLITE' || promoInput.toUpperCase() === 'COFFEE10') {
      setPromoApplied(true)
      setPromoError(null)
      onApplyPromo?.(promoInput.toUpperCase())
    } else {
      setPromoError('Mã ưu đãi không hợp lệ hoặc đã hết hạn')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>☕</span> Danh sách món đã chọn
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Xem lại, tùy chỉnh số lượng hoặc thêm/bớt món trước khi đặt
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 shrink-0">
          {items.reduce((acc, curr) => acc + curr.quantity, 0)} ly
        </span>
      </div>

      {/* Item List (with increase, decrease & remove) */}
      <div className="divide-y divide-stone-100 max-h-84 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <span className="text-3xl">🧺</span>
            <p className="text-sm text-stone-400 italic">
              Chưa có món nào trong đơn hàng
            </p>
          </div>
        ) : (
          items.map((item) => (
            <OrderItemCard
              key={`${item.productId}-${item.size}`}
              item={item}
              onQuantityChange={(delta) =>
                onUpdateQuantity?.(item.productId, item.size, delta)
              }
              onRemove={() => onRemoveItem?.(item.productId, item.size)}
            />
          ))
        )}
      </div>

      {/* Quick Add Menu Items */}
      {onAddQuickItem && (
        <div className="pt-2 border-t border-dashed border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <span>+</span> Thêm món nhanh vào đơn:
            </span>
            <button
              type="button"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="text-xs text-amber-800 font-semibold hover:underline"
            >
              {showQuickAdd ? 'Thu gọn' : 'Xem gợi ý món'}
            </button>
          </div>

          {showQuickAdd && (
            <div className="mt-2.5 grid grid-cols-1 gap-2 animate-fadeIn">
              {QUICK_ADD_DRINKS.map((quickDrink) => (
                <div
                  key={quickDrink.productId}
                  className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-200/60 hover:bg-amber-100/50 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥤</span>
                    <div>
                      <p className="font-semibold text-stone-900">{quickDrink.name}</p>
                      <p className="text-[11px] text-amber-900 font-medium">
                        {formatCurrency(quickDrink.price)} (Size {quickDrink.size})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddQuickItem(quickDrink)}
                    className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    + Thêm
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="space-y-1 pt-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Mã ưu đãi (vd: BREWLITE)"
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            Áp dụng
          </button>
        </div>
        {promoApplied && (
          <p className="text-xs text-emerald-600 font-medium">✓ Đã áp dụng mã giảm giá 20.000₫!</p>
        )}
        {promoError && (
          <p className="text-xs text-rose-500 font-medium">{promoError}</p>
        )}
      </form>

      {/* Price Calculations */}
      <div className="space-y-2.5 pt-4 border-t border-stone-100 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Tạm tính đồ uống</span>
          <span className="font-medium text-stone-800">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Ưu đãi thành viên</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-4 border-t border-stone-200">
          <span className="text-base font-bold text-stone-900">Tổng thanh toán</span>
          <div className="text-right">
            <span className="text-xl font-extrabold text-amber-900 tracking-tight">
              {formatCurrency(total)}
            </span>
            <p className="text-[11px] text-stone-400">Thanh toán không dùng tiền mặt</p>
          </div>
        </div>
      </div>

      {/* Trust Badges for Coffee Shop */}
      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-500">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-stone-50">
          <span>☕</span> 100% Cà phê nguyên chất
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-stone-50">
          <span>⚡</span> Đặt trước nhận ngay tại quầy
        </div>
      </div>
    </div>
  )
}
