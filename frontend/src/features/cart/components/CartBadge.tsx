'use client'

import Link from 'next/link'
import { useCartStore } from '../stores/cartStore'

export function CartBadge() {
  const count = useCartStore(
    (state) => state.getTotalItems(),
  )

  return (
    <Link
      href="/cart"
      aria-label={`Giỏ hàng, ${count} sản phẩm`}
      className="fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-amber-700"
    >
      Giỏ hàng

      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700">
        {count}
      </span>
    </Link>
  )
}