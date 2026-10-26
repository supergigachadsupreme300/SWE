import { apiGet } from '../../../services/api'
import type { OrderDetail } from '../../order/types'

const LOCAL_STORAGE_ORDERS_KEY = 'brewlite_mock_orders'

function getLocalOrders(): OrderDetail[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as OrderDetail[]) : []
  } catch {
    return []
  }
}

/**
 * Loads orders from the backend and combines them with locally-created mock
 * orders. This keeps the unfinished project demo usable while the backend is
 * being developed. The backend currently returns all orders (not user-scoped).
 */
export async function fetchOrderHistory(): Promise<OrderDetail[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('brewlite_token') : null
    const endpoint = token ? '/orders/me' : '/orders'
    const response = await apiGet<OrderDetail[]>(endpoint, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
    const backendOrders = Array.isArray(response) ? response : []
    const localOrders = getLocalOrders()
    const byId = new Map<string, OrderDetail>()

    // Backend records take precedence if the same order exists in both places.
    for (const order of localOrders) byId.set(order.id, order)
    for (const order of backendOrders) byId.set(order.id, order)

    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch (error) {
    const localOrders = getLocalOrders()
    if (localOrders.length > 0) {
      return [...localOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }
    throw error
  }
}

export async function fetchOrderHistoryDetail(orderId: string): Promise<OrderDetail> {
  try {
    return await apiGet<OrderDetail>(`/orders/${encodeURIComponent(orderId)}`)
  } catch (error) {
    const localOrder = getLocalOrders().find((order) => order.id === orderId)
    if (localOrder) return localOrder
    throw new Error(`Không tìm thấy đơn hàng #${orderId}.`)
  }
}
