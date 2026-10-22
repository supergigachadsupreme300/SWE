'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OrderDetail, OrderStatus } from '../types'
import { fetchOrderById, updateOrderStatus } from '../services/orderApi'

interface UseOrderDetailResult {
  order: OrderDetail | null
  isLoading: boolean
  isUpdating: boolean
  error: string | null
  changeStatus: (status: OrderStatus) => Promise<boolean>
  refresh: () => Promise<void>
}

export function useOrderDetail(orderId?: string): UseOrderDetailResult {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(orderId))
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchOrderById(id)
      setOrder(data)
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thông tin đơn hàng.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (orderId) {
      load(orderId)
    }
  }, [orderId, load])

  const changeStatus = useCallback(
    async (nextStatus: OrderStatus): Promise<boolean> => {
      if (!order) return false
      setIsUpdating(true)
      setError(null)
      try {
        const updated = await updateOrderStatus(order.id, nextStatus)
        setOrder(updated)
        return true
      } catch (err: any) {
        setError(err?.message || `Không thể cập nhật trạng thái sang ${nextStatus}.`)
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [order],
  )

  const refresh = useCallback(async () => {
    if (order?.id) {
      await load(order.id)
    } else if (orderId) {
      await load(orderId)
    }
  }, [order?.id, orderId, load])

  return {
    order,
    isLoading,
    isUpdating,
    error,
    changeStatus,
    refresh,
  }
}
