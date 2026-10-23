import { OrderHistoryDetailPageContent } from '../../../features/order-history'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderHistoryDetailPageContent orderId={params.id} />
}
