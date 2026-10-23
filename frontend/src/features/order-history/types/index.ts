import type { OrderDetail, OrderStatus } from '../../order/types'

export type { OrderDetail, OrderStatus }

export interface OrderHistoryFilters {
  keyword: string
  status: OrderStatus | 'ALL'
}
