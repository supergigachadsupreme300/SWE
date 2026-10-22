'use client'

import { useState, useCallback } from 'react'
import type { OrderCreatePayload, OrderDetail } from '../types'
import { createOrder } from '../services/orderApi'

interface UseCreateOrderResult {
  submitOrder: (payload: OrderCreatePayload) => Promise<OrderDetail | null>
  isLoading: boolean
  error: string | null
  order: OrderDetail | null
  isSuccess: boolean
  reset: () => void
}

export function useCreateOrder(): UseCreateOrderResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const submitOrder = useCallback(async (payload: OrderCreatePayload): Promise<OrderDetail | null> => {
    setIsLoading(true)
    setError(null)
    try {
      if (!payload.items || payload.items.length === 0) {
        throw new Error('Giỏ hàng không có sản phẩm để đặt hàng.')
      }

      const created = await createOrder(payload)
      setOrder(created)
      setIsSuccess(true)

      // Clear cart items if bridge or localStorage is used
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('brewlite_cart')
          localStorage.removeItem('brewlite:cart')
          window.dispatchEvent(new CustomEvent('brewlite:cart-cleared'))
        } catch {
          // ignore
        }
      }

      return created
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin và thử lại.'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setOrder(null)
    setIsSuccess(false)
  }, [])

  return {
    submitOrder,
    isLoading,
    error,
    order,
    isSuccess,
    reset,
  }
}
