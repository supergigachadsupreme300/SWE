import React from 'react'

type QuantitySelectorProps = {
  value: number
  max: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function QuantitySelector({ value, max, onChange, disabled = false }: QuantitySelectorProps) {
  const limit = Math.max(1, max)
  const canDecrease = !disabled && value > 1
  const canIncrease = !disabled && value < limit

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        className="px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
      >
        -
      </button>
      <span className="min-w-[2.5rem] text-center text-sm font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        className="px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
      >
        +
      </button>
    </div>
  )
}
