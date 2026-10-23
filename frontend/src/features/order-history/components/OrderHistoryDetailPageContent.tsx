'use client'

import { useOrderHistoryDetail } from '../hooks/useOrderHistoryDetail'
import { OrderHistoryDetail } from './OrderHistoryDetail'
import { OrderHistoryDetailState } from './OrderHistoryDetailState'

export function OrderHistoryDetailPageContent({ orderId }: { orderId: string }) {
  const { order, isLoading, error, reload } = useOrderHistoryDetail(orderId)

  if (isLoading || error || !order) {
    return (
      <OrderHistoryDetailState
        isLoading={isLoading}
        error={error}
        onRetry={() => void reload()}
      />
    )
  }

  return <OrderHistoryDetail order={order} />
}
