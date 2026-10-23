'use client'

import Link from 'next/link'

export function OrderHistoryDetailState({
  isLoading,
  error,
  onRetry,
}: {
  isLoading: boolean
  error: string
  onRetry: () => void
}) {
  return (
    <div className="min-h-[70vh] bg-[#FBF9F5] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        {isLoading ? (
          <>
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-amber-700 border-t-transparent" />
            <h1 className="mt-4 text-lg font-extrabold">Đang tải chi tiết đơn hàng...</h1>
          </>
        ) : (
          <>
            <div className="text-4xl" aria-hidden="true">⚠️</div>
            <h1 className="mt-4 text-xl font-extrabold">Không thể mở đơn hàng</h1>
            <p className="mt-2 text-sm text-stone-600">{error || 'Đã xảy ra lỗi khi tải dữ liệu.'}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={onRetry} className="rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-800">Thử lại</button>
              <Link href="/orders" className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-bold text-stone-700 hover:border-amber-700">Về lịch sử đơn</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
