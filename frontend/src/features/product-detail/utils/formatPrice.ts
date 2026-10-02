const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || 'VND'
const LOCALE = process.env.NEXT_PUBLIC_CURRENCY_LOCALE || 'vi-VN'

export function formatPrice(value: number, currency: string = CURRENCY, locale: string = LOCALE): string {
  const safeValue = Number.isFinite(value) ? value : 0
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: CURRENCY === 'VND' ? 0 : 2,
    }).format(safeValue)
  } catch {
    return `${safeValue} ${currency}`
  }
}
