'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '../stores/cartStore'

export function CartBadge() {
  const count = useCartStore(
    (state) => state.getTotalItems(),
  )
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('brewlite_token'))
  }, [])

  function handleLogout() {
    localStorage.removeItem('brewlite_token')
    localStorage.removeItem('brewlite_user_id')
    setIsLoggedIn(false)
    window.location.href = '/auth/login'
  }

  if (!isLoggedIn) return null

  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-2">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-stone-700"
      >
        Lịch sử đơn
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-red-700"
      >
        Đăng xuất
      </button>

      <Link
      href="/cart"
      aria-label={`Giỏ hàng, ${count} sản phẩm`}
        className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-amber-700"
      >
        Giỏ hàng

        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700">
          {count}
        </span>
      </Link>
    </div>
  )
}