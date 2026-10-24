'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '../stores/cartStore'

function formatVND(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartView() {
  const items = useCartStore((state) => state.items)

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity,
  )

  const removeItem = useCartStore(
    (state) => state.removeItem,
  )

  const clearCart = useCartStore(
    (state) => state.clearCart,
  )

  const totalItems = useCartStore(
    (state) => state.getTotalItems(),
  )

  const totalPrice = useCartStore(
    (state) => state.getTotalPrice(),
  )

  const [message, setMessage] = useState('')

  const changeQuantity = (
    productId: string,
    quantity: number,
  ) => {
    const result = updateQuantity(productId, quantity)
    setMessage(result.message)
  }

  const handleRemove = (productId: string) => {
    removeItem(productId)
    setMessage('Đã xóa sản phẩm khỏi giỏ hàng.')
  }

  const handleClearCart = () => {
    clearCart()
    setMessage('Đã xóa toàn bộ giỏ hàng.')
  }

  return (
    <section className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Giỏ hàng
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems} sản phẩm
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-semibold text-amber-700 hover:underline"
        >
          ← Tiếp tục mua hàng
        </Link>
      </div>

      {message ? (
        <p
          role="status"
          className="mb-4 text-sm text-amber-800"
        >
          {message}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Giỏ hàng đang trống
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Hãy chọn sản phẩm bạn yêu thích từ menu BrewLite.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-amber-600 px-5 py-2 font-semibold text-white hover:bg-amber-700"
          >
            Xem menu
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.productId}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-sm text-gray-400">No image</span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatVND(item.unitPrice)} / sản phẩm
                  </p>

                  <p className="mt-1 text-sm font-semibold text-amber-800">
                    Thành tiền:{' '}
                    {formatVND(
                      item.unitPrice * item.quantity,
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Giảm số lượng ${item.name}`}
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      changeQuantity(
                        item.productId,
                        item.quantity - 1,
                      )
                    }
                    className="h-9 w-9 rounded border border-gray-300 disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="min-w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    aria-label={`Tăng số lượng ${item.name}`}
                    disabled={item.quantity >= item.stock}
                    onClick={() =>
                      changeQuantity(
                        item.productId,
                        item.quantity + 1,
                      )
                    }
                    className="h-9 w-9 rounded border border-gray-300 disabled:opacity-40"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(item.productId)
                    }
                    className="ml-2 text-sm font-semibold text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">
                Tổng cộng
              </span>

              <strong className="text-amber-800">
{formatVND(totalPrice)}
              </strong>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Tổng tiền được tính tự động theo đơn giá × số lượng.
            </p>

            <div className="mt-5 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Xóa giỏ hàng
              </button>

              <Link
                href="/checkout"
                className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}