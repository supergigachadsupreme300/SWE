'use client'

import Link from 'next/link'
import { useOrderHistory } from '../hooks/useOrderHistory'
import { OrderHistoryCard } from './OrderHistoryCard'
import { OrderHistoryFilters } from './OrderHistoryFilters'

export function OrderHistoryList() {
  const {
    orders,
    filteredOrders,
    keyword,
    setKeyword,
    status,
    setStatus,
    isLoading,
    error,
    reload,
  } = useOrderHistory()

  return (
    <div className="min-h-screen bg-[#FBF9F5] px-4 pb-16 pt-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-amber-900 hover:text-amber-700">← BrewLite</Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">BrewLite · Order History</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Lịch sử đơn hàng</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Theo dõi các đơn hàng, xem trạng thái và kiểm tra lại thông tin đặt món.
            </p>
          </div>
          <Link href="/cart" className="inline-flex w-fit rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 hover:border-amber-700 hover:text-amber-900">
            Tiếp tục mua hàng
          </Link>
        </header>

        {!isLoading && !error && orders.length > 0 && (
          <div className="mb-4 text-sm text-stone-500">
            Có <strong className="text-stone-800">{orders.length}</strong> đơn hàng
          </div>
        )}

        <OrderHistoryFilters
          keyword={keyword}
          status={status}
          onKeywordChange={setKeyword}
          onStatusChange={setStatus}
        />

        <section className="mt-5 space-y-4" aria-live="polite">
          {isLoading && (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-amber-700 border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-stone-600">Đang tải lịch sử đơn hàng...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
              <p className="font-bold text-rose-800">Không thể tải lịch sử đơn hàng</p>
              <p className="mt-2 text-sm text-rose-700">{error}</p>
              <button onClick={() => void reload()} className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800">
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <div className="text-4xl" aria-hidden="true">☕</div>
              <h2 className="mt-4 text-lg font-extrabold">Bạn chưa có đơn hàng nào</h2>
              <p className="mt-2 text-sm text-stone-500">Những đơn hàng bạn đặt sẽ xuất hiện tại đây.</p>
              <Link href="/checkout" className="mt-5 inline-flex rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-800">
                Đặt món ngay
              </Link>
            </div>
          )}

          {!isLoading && !error && orders.length > 0 && filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
              <h2 className="font-bold text-stone-800">Không tìm thấy đơn hàng phù hợp</h2>
              <p className="mt-2 text-sm text-stone-500">Thử đổi mã đơn hoặc chọn trạng thái khác.</p>
              <button
                onClick={() => { setKeyword(''); setStatus('ALL') }}
                className="mt-4 text-sm font-bold text-amber-900 underline underline-offset-4"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {!isLoading && !error && filteredOrders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </section>

        <p className="mt-8 text-xs leading-5 text-stone-400">
          Lưu ý: phiên bản đồ án hiện tại chưa hoàn thiện xác thực và phân quyền lịch sử đơn hàng.
        </p>
      </div>
    </div>
  )
}
