import type { OrderStatus } from '../../order/types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  PAID: 'Đã thanh toán',
  PREPARING: 'Đang chuẩn bị',
  READY: 'Sẵn sàng nhận',
  COMPLETED: 'Hoàn tất',
  PAYMENT_FAILED: 'Thanh toán thất bại',
  CANCELLED: 'Đã hủy',
}

export function formatOrderDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa có thông tin'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function statusClass(status: OrderStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'CANCELLED':
    case 'PAYMENT_FAILED':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'READY':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'PAID':
    case 'PREPARING':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200'
  }
}
