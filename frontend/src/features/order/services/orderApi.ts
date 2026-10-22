import { apiGet, apiPost, apiPatch } from '../../../services/api'
import type { OrderCreatePayload, OrderDetail, OrderStatus } from '../types'

const LOCAL_STORAGE_ORDERS_KEY = 'brewlite_mock_orders'

function getLocalOrders(): OrderDetail[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalOrder(order: OrderDetail) {
  if (typeof window === 'undefined') return
  try {
    const orders = getLocalOrders()
    const index = orders.findIndex((o) => o.id === order.id)
    if (index >= 0) {
      orders[index] = order
    } else {
      orders.unshift(order)
    }
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Creates an order by sending a request to POST /orders.
 * Falls back to local mock persistence if backend is offline.
 * Initial status is PENDING as per Section 9.1.
 */
export async function createOrder(payload: OrderCreatePayload): Promise<OrderDetail> {
  try {
    const result = await apiPost<OrderDetail>('/orders', payload)
    return result
  } catch (backendError: any) {
    if (backendError?.message && !backendError.message.includes('Failed to fetch') && !backendError.message.includes('API POST error')) {
      throw backendError
    }

    // Simulate mock order creation for BrewLite counter pickup
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockOrderId = 'BL-' + Math.floor(1000 + Math.random() * 9000)
    const newOrder: OrderDetail = {
      id: mockOrderId,
      userId: payload.userId || 'usr_canteen_guest',
      total: payload.total,
      status: 'PENDING',
      customerInfo: payload.customerInfo,
      items: payload.items.map((item, index) => ({
        id: `item_${index + 1}_${mockOrderId}`,
        orderId: mockOrderId,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size || 'M',
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveLocalOrder(newOrder)
    return newOrder
  }
}

/**
 * Fetches order details by ID from GET /orders/:id.
 */
export async function fetchOrderById(orderId: string): Promise<OrderDetail> {
  try {
    return await apiGet<OrderDetail>(`/orders/${encodeURIComponent(orderId)}`)
  } catch (error) {
    const local = getLocalOrders().find((o) => o.id === orderId)
    if (local) return local
    throw new Error(`Đơn hàng #${orderId} không tìm thấy.`)
  }
}

/**
 * Updates order status via PATCH /orders/:id.
 * State machine: PENDING -> PAID -> PREPARING -> READY -> COMPLETED (kèm PAYMENT_FAILED, CANCELLED)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDetail> {
  try {
    return await apiPatch<OrderDetail>(`/orders/${encodeURIComponent(orderId)}`, { status })
  } catch (error) {
    const localOrders = getLocalOrders()
    const found = localOrders.find((o) => o.id === orderId)
    if (found) {
      found.status = status
      found.updatedAt = new Date().toISOString()
      saveLocalOrder(found)
      return found
    }
    throw error
  }
}
