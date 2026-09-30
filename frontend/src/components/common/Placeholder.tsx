import React from 'react'

export function Placeholder({ title = 'Component' }: { title?: string }) {
  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <strong className="text-sm text-gray-700">{title}</strong>
      <div className="text-xs text-gray-400">(placeholder)</div>
    </div>
  )
}
