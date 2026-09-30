import React from 'react'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold">Product {params.id} (placeholder)</h2>
    </div>
  )
}
