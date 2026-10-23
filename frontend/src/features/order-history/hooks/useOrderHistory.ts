'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { OrderDetail, OrderStatus } from '../../order/types'
import { fetchOrderHistory } from '../services/orderHistoryApi'

export function useOrderHistory() {
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await fetchOrderHistory()
      setOrders(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử đơn hàng.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesKeyword = !normalizedKeyword || order.id.toLowerCase().includes(normalizedKeyword)
      const matchesStatus = status === 'ALL' || order.status === status
      return matchesKeyword && matchesStatus
    })
  }, [orders, keyword, status])

  return {
    orders,
    filteredOrders,
    keyword,
    setKeyword,
    status,
    setStatus,
    isLoading,
    error,
    reload: loadOrders,
  }
}
