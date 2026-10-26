'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckoutForm,
  OrderSummary,
  OrderConfirmation,
  useCreateOrder,
  OrderItem,
  CustomerPickupInfo,
  PaymentMethod,
  OrderCreatePayload,
} from '../../features/order'
import { useCartStore } from '../../features/cart'

// Sample initial cart items for testing and review
const INITIAL_CART_ITEMS: OrderItem[] = [
  {
    productId: 'prod_macchiato_01',
    name: 'Caramel Macchiato Đặc Biệt',
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=150&auto=format&fit=crop&q=80',
    price: 49000,
    quantity: 2,
    size: 'M',
    lineTotal: 98000,
  },
  {
    productId: 'prod_coldbrew_02',
    name: 'Cold Brew Cam Sả Thượng Hạng',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=150&auto=format&fit=crop&q=80',
    price: 55000,
    quantity: 1,
    size: 'L',
    lineTotal: 55000,
  },
]

export default function CheckoutPage() {
  const [items, setItems] = useState<OrderItem[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const { submitOrder, isLoading, error, order, isSuccess, reset } = useCreateOrder()

  // Load cart from cart store/localStorage or fallback to initial items
  useEffect(() => {
    try {
      const storeItems = useCartStore.getState().items
      if (Array.isArray(storeItems) && storeItems.length > 0) {
        const normalized = storeItems.map((item: any, idx: number) => ({
          productId: item.productId || `prod_${idx}`,
          name: item.name || 'Cà Phê BrewLite',
          imageUrl: item.imageUrl,
          price: Number(item.unitPrice) || 45000,
          quantity: Number(item.quantity) || 1,
          size: item.size || 'M',
          toppings: Array.isArray(item.toppings) ? item.toppings : [],
          lineTotal: (Number(item.unitPrice) || 45000) * (Number(item.quantity) || 1),
        }))
        setItems(normalized)
        setIsLoaded(true)
        return
      }

      const stored = localStorage.getItem('brewlite_cart') || localStorage.getItem('brewlite:cart') || localStorage.getItem('brewlite-cart')
      if (stored) {
        const raw = JSON.parse(stored)
        const parsed = Array.isArray(raw) ? raw : Array.isArray(raw?.state?.items) ? raw.state.items : []
        if (parsed.length > 0) {
          const normalized = parsed.map((item: any, idx: number) => ({
            productId: item.productId || item.id || `prod_${idx}`,
            name: item.name || item.title || 'Cà Phê BrewLite',
            imageUrl: item.imageUrl || item.image,
            price: Number(item.price) || 45000,
            quantity: Number(item.quantity) || 1,
            size: item.size || 'M',
            toppings: Array.isArray(item.toppings) ? item.toppings : [],
            lineTotal: (Number(item.price) || 45000) * (Number(item.quantity) || 1),
          }))
          setItems(normalized)
          setIsLoaded(true)
          return
        }
      }
    } catch {
      // ignore
    }

    setItems(INITIAL_CART_ITEMS)
    setIsLoaded(true)
  }, [])

  // 1. Tùy chỉnh số lượng (+ / -)
  const handleUpdateQuantity = (productId: string, size: string | undefined, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size) {
          const newQty = Math.max(1, item.quantity + delta)
          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.price,
          }
        }
        return item
      }),
    )
  }

  // 2. Xóa món khỏi đơn hàng
  const handleRemoveItem = (productId: string, size: string | undefined) => {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size)),
    )
  }

  // 3. Thêm nhanh món mới vào đơn
  const handleAddQuickItem = (newItem: OrderItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.productId === newItem.productId && it.size === newItem.size,
      )
      if (existingIndex >= 0) {
        const updated = [...prev]
        const current = updated[existingIndex]
        const newQty = current.quantity + 1
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          lineTotal: newQty * current.price,
        }
        return updated
      }
      return [...prev, newItem]
    })
  }

  // 4. Nạp lại danh sách mẫu
  const handleResetToSample = () => {
    setItems(INITIAL_CART_ITEMS)
    reset()
  }

  const subtotal = items.reduce((acc, curr) => acc + curr.lineTotal, 0)
  const grandTotal = Math.max(0, subtotal - discount)

  const handleApplyPromo = (code: string) => {
    if (code === 'BREWLITE' || code === 'COFFEE10') {
      setDiscount(20000)
    }
  }

  // 5. Submit đơn hàng
  const handleFormSubmit = async (data: {
    customerInfo: CustomerPickupInfo
    paymentMethod: PaymentMethod
  }) => {
    if (items.length === 0) {
      alert('Đơn hàng phải có ít nhất 1 món để đặt.')
      return
    }

    const payload: OrderCreatePayload = {
      items: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        size: it.size,
        toppings: it.toppings,
        unitPrice: it.price,
        lineTotal: it.lineTotal,
      })),
      total: grandTotal,
      customerInfo: data.customerInfo,
      paymentMethod: data.paymentMethod,
    }

    await submitOrder(payload)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Đang tải trang thanh toán...</p>
        </div>
      </div>
    )
  }

  // Màn hình xác nhận tạo đơn thành công (Order Confirmation)
  if (isSuccess && order) {
    return (
      <div className="min-h-screen bg-stone-50/70 py-12 px-4 sm:px-6 lg:px-8">
        <OrderConfirmation
          order={order}
          onContinueShopping={handleResetToSample}
        />
      </div>
    )
  }

  // Màn hình Checkout chính (Review đơn + Chỉnh sửa món + Form đặt hàng)
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 pb-20">
      {/* Top Header Navigation */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">☕</span>
            <span className="font-extrabold text-lg tracking-tight text-amber-950 group-hover:text-amber-800 transition-colors">
              BrewLite
            </span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
              Order & Checkout
            </span>
          </Link>

          {/* Stepper indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <span className="text-stone-400">1. Giỏ hàng</span>
            <span className="text-stone-300">›</span>
            <span className="text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              2. Review món & Đặt hàng
            </span>
            <span className="text-stone-300">›</span>
            <span className="text-stone-400">3. Xác nhận đơn</span>
          </div>

          <Link
            href="/cart"
            className="text-xs font-semibold text-stone-600 hover:text-amber-900 transition-colors flex items-center gap-1"
          >
            ← Quay lại giỏ
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* Page Title & Backlinks */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Review Đơn Hàng & Checkout
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Phạm vi <strong>Member 5</strong>: Order, OrderItem, Validate, Review & Tùy chỉnh món, Đặt hàng và Trạng thái đơn.
            </p>
          </div>

          {items.length === 0 && (
            <button
              onClick={handleResetToSample}
              className="text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-xl transition-colors self-start"
            >
              + Nạp lại đồ uống mẫu
            </button>
          )}
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm animate-shake">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-bold">Không thể hoàn tất đặt hàng</p>
              <p className="text-xs mt-0.5 text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Two-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form thông tin & Thanh toán */}
          <section className="lg:col-span-7">
            <CheckoutForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              disabled={items.length === 0}
            />
          </section>

          {/* Right Column: Review & Tùy chỉnh danh sách món (Sticky) */}
          <aside className="lg:col-span-5 sticky top-24">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              onApplyPromo={handleApplyPromo}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onAddQuickItem={handleAddQuickItem}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
