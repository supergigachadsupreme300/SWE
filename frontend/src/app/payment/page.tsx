
'use client'

import { useState } from 'react'
import type {
  PaymentMethod,
  PaymentPayload,
  PaymentResult,
} from '@/features/payment'

export default function PaymentPage() {
  const [orderId, setOrderId] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('WALLET')
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePayment() {
    if (!orderId.trim()) {
      setError('Vui lòng nhập Order ID.')
      setResult(null)
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    const payload: PaymentPayload = {
      orderId: orderId.trim(),
      method,
      idempotencyKey: crypto.randomUUID(),
    }

    try {
      const response = await fetch('http://localhost:8000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xử lý thanh toán.')
      }

      setResult(data as PaymentResult)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể kết nối đến backend.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-2 text-2xl font-bold">Thanh toán đơn hàng</h1>
        <p className="mb-6 text-sm text-gray-500">
          Chọn phương thức thanh toán để tiếp tục.
        </p>

        <label className="mb-2 block text-sm font-medium">
          Order ID
        </label>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Nhập mã đơn hàng"
          className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <p className="mb-3 text-sm font-medium">Phương thức thanh toán</p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('WALLET')}
            className={`rounded-lg border p-4 text-left ${
              method === 'WALLET'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300'
            }`}
          >
            <span className="block font-semibold">Ví điện tử</span>
            <span className="mt-1 block text-sm">WALLET</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('CARD')}
            className={`rounded-lg border p-4 text-left ${
              method === 'CARD'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300'
            }`}
          >
            <span className="block font-semibold">Thẻ</span>
            <span className="mt-1 block text-sm">CARD</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán'}
        </button>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Thanh toán chưa thành công</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-3 font-semibold underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {result && (
          <div
            className={`mt-5 rounded-lg p-4 ${
              result.paymentStatus === 'SUCCESS'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <h2 className="font-bold">
              {result.paymentStatus === 'SUCCESS'
                ? 'Thanh toán thành công'
                : 'Thanh toán thất bại'}
            </h2>
            <p className="mt-2">{result.message}</p>
            <div className="mt-3 space-y-1 text-sm">
              <p>Mã thanh toán: {result.paymentId}</p>
              <p>Mã đơn hàng: {result.orderId}</p>
              <p>
                Số tiền: {result.amount.toLocaleString('vi-VN')} VND
              </p>
              <p>
                Phương thức:{' '}
                {result.method === 'WALLET' ? 'Ví điện tử' : 'Thẻ'}
              </p>
              <p>Trạng thái thanh toán: {result.paymentStatus}</p>
              <p>Trạng thái đơn hàng: {result.orderStatus}</p>
            </div>

            {result.paymentStatus === 'FAILED' && (
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="mt-3 font-semibold underline"
              >
                Thanh toán lại
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
