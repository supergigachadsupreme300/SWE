'use client'

import React, { useState } from 'react'
import type { CustomerPickupInfo, PaymentMethod, CheckoutFormErrors } from '../types'

interface CheckoutFormProps {
  initialCustomerInfo?: Partial<CustomerPickupInfo>
  onSubmit: (data: { customerInfo: CustomerPickupInfo; paymentMethod: PaymentMethod }) => void
  isLoading?: boolean
  disabled?: boolean
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  initialCustomerInfo,
  onSubmit,
  isLoading = false,
  disabled = false,
}) => {
  const [formData, setFormData] = useState<CustomerPickupInfo>({
    customerName: initialCustomerInfo?.customerName || '',
    customerPhone: initialCustomerInfo?.customerPhone || '',
    pickupType: initialCustomerInfo?.pickupType || 'AT_COUNTER',
    tableNumber: initialCustomerInfo?.tableNumber || '',
    note: initialCustomerInfo?.note || '',
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOMO')
  const [errors, setErrors] = useState<CheckoutFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Field validator
  const validateField = (field: keyof CustomerPickupInfo, value: string): string | undefined => {
    switch (field) {
      case 'customerName':
        if (!value.trim()) return 'Vui lòng nhập tên người nhận đồ uống'
        if (value.trim().length < 2) return 'Tên tối thiểu 2 ký tự'
        return undefined
      case 'customerPhone':
        if (!value.trim()) return 'Vui lòng nhập số điện thoại để nhận thông báo lấy nước'
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
          return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)'
        }
        return undefined
      case 'tableNumber':
        if (formData.pickupType === 'DINE_IN' && !value.trim()) {
          return 'Vui lòng nhập số bàn nếu dùng tại quán'
        }
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (field: keyof CustomerPickupInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const errorMsg = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: errorMsg }))
    }
  }

  const handleBlur = (field: keyof CustomerPickupInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const errorMsg = validateField(field, formData[field] || '')
    setErrors((prev) => ({ ...prev, [field]: errorMsg }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: CheckoutFormErrors = {
      customerName: validateField('customerName', formData.customerName),
      customerPhone: validateField('customerPhone', formData.customerPhone),
      tableNumber: validateField('tableNumber', formData.tableNumber || ''),
    }

    setTouched({
      customerName: true,
      customerPhone: true,
      tableNumber: true,
    })

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some(Boolean)
    if (!hasErrors) {
      onSubmit({ customerInfo: formData, paymentMethod })
    }
  }

  const isFormValid =
    !validateField('customerName', formData.customerName) &&
    !validateField('customerPhone', formData.customerPhone) &&
    !validateField('tableNumber', formData.tableNumber || '')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Thông tin khách hàng & Hình thức nhận tại quầy */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
            1
          </span>
          <div>
            <h3 className="text-base font-bold text-stone-900">Thông tin nhận đồ uống tại quầy</h3>
            <p className="text-xs text-stone-500">
              Nhận nước trực tiếp tại quầy pha chế Barista khi có thông báo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tên người nhận */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Tên người nhận nước <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              onBlur={() => handleBlur('customerName')}
              placeholder="Ví dụ: Hoàng Long, Minh Anh..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                touched.customerName && errors.customerName
                  ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-stone-200 focus:border-amber-600 focus:ring-amber-500/20'
              }`}
            />
            {touched.customerName && errors.customerName && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customerName}</p>
            )}
          </div>

          {/* SĐT */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleChange('customerPhone', e.target.value)}
              onBlur={() => handleBlur('customerPhone')}
              placeholder="0912345678"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                touched.customerPhone && errors.customerPhone
                  ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-stone-200 focus:border-amber-600 focus:ring-amber-500/20'
              }`}
            />
            {touched.customerPhone && errors.customerPhone && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customerPhone}</p>
            )}
          </div>
        </div>

        {/* Hình thức nhận */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Hình thức nhận món <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange('pickupType', 'AT_COUNTER')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                formData.pickupType === 'AT_COUNTER'
                  ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl">🥤</span>
              <div>
                <p className="text-sm font-bold text-stone-900">Mang đi (Take-away)</p>
                <p className="text-[11px] text-stone-500">Đến lấy tại quầy pha chế</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChange('pickupType', 'DINE_IN')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                formData.pickupType === 'DINE_IN'
                  ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl">☕</span>
              <div>
                <p className="text-sm font-bold text-stone-900">Dùng tại quán (Dine-in)</p>
                <p className="text-[11px] text-stone-500">Ngồi tại bàn trong căn tin</p>
              </div>
            </button>
          </div>
        </div>

        {/* Số bàn (nếu DINE_IN) */}
        {formData.pickupType === 'DINE_IN' && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Số bàn ngồi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tableNumber || ''}
              onChange={(e) => handleChange('tableNumber', e.target.value)}
              onBlur={() => handleBlur('tableNumber')}
              placeholder="Ví dụ: Bàn 04, Khu B..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                touched.tableNumber && errors.tableNumber
                  ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-stone-200 focus:border-amber-600 focus:ring-amber-500/20'
              }`}
            />
            {touched.tableNumber && errors.tableNumber && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.tableNumber}</p>
            )}
          </div>
        )}

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Ghi chú pha chế / Lưu ý (tuỳ chọn)
          </label>
          <textarea
            value={formData.note || ''}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={2}
            placeholder="Ví dụ: 50% ngọt, ít đá, cho thêm ống hút giấy..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
        </div>
      </div>

      {/* 2. Thanh toán không tiền mặt (Mục 3.1 & 4.1 BrewLite) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="text-base font-bold text-stone-900">Thanh toán không dùng tiền mặt</h3>
            <p className="text-xs text-stone-500">Mô hình BrewLite thanh toán số tiện lợi, không xếp hàng</p>
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'MOMO'
                ? 'border-amber-700 bg-amber-50/40 shadow-xs'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="MOMO"
                checked={paymentMethod === 'MOMO'}
                onChange={() => setPaymentMethod('MOMO')}
                className="w-4 h-4 text-amber-700 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">Ví điện tử MoMo</p>
                <p className="text-xs text-stone-500">Xác nhận thanh toán một chạm qua ví MoMo</p>
              </div>
            </div>
            <span className="text-xl">📱</span>
          </label>

          <label
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'BANK_TRANSFER'
                ? 'border-amber-700 bg-amber-50/40 shadow-xs'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="BANK_TRANSFER"
                checked={paymentMethod === 'BANK_TRANSFER'}
                onChange={() => setPaymentMethod('BANK_TRANSFER')}
                className="w-4 h-4 text-amber-700 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">Chuyển khoản VietQR</p>
                <p className="text-xs text-stone-500">Quét mã QR ngân hàng thanh toán tự động</p>
              </div>
            </div>
            <span className="text-xl">🏦</span>
          </label>

          <label
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'CARD'
                ? 'border-amber-700 bg-amber-50/40 shadow-xs'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === 'CARD'}
                onChange={() => setPaymentMethod('CARD')}
                className="w-4 h-4 text-amber-700 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">Thẻ nội địa / Quốc tế</p>
                <p className="text-xs text-stone-500">Thanh toán qua cổng Napas / Visa / MasterCard</p>
              </div>
            </div>
            <span className="text-xl">💳</span>
          </label>
        </div>
      </div>

      {/* Nút đặt hàng */}
      <button
        type="submit"
        disabled={disabled || isLoading || !isFormValid}
        className={`w-full py-4 rounded-2xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
          disabled || !isFormValid || isLoading
            ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white shadow-amber-900/20 active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Đang tạo đơn hàng...
          </>
        ) : (
          <>
            <span>☕</span> Xác nhận đặt món & Thanh toán
          </>
        )}
      </button>
    </form>
  )
}
