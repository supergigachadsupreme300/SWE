'use client'

import { useCallback, useEffect, useState } from 'react'
import type { OrderDetail } from '../../order/types'
import { fetchOrderHistoryDetail } from '../services/orderHistoryApi'

export function useOrderHistoryDetail(orderId: string) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      setOrder(await fetchOrderHistoryDetail(orderId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng.')
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    void loadOrder()
  }, [loadOrder])

  return { order, isLoading, error, reload: loadOrder }
}
