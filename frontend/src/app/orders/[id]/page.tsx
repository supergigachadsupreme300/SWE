import React from 'react'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold">Order {params.id} (placeholder)</h2>
    </div>
  )
}
