import type { ProductDetail, RelatedProduct, StockState } from '../types'
import { LOW_STOCK_THRESHOLD } from '../types'

type RawRecord = Record<string, unknown>

export function getStockState(stock: number): StockState {
  if (stock <= 0) return 'out-of-stock'
  if (stock <= LOW_STOCK_THRESHOLD) return 'low-stock'
  return 'in-stock'
}

function toRecord(value: unknown): RawRecord {
  return value && typeof value === 'object' ? (value as RawRecord) : {}
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return undefined
}

function toOptionalString(value: unknown): string | null {
  const text = toStringValue(value)
  return text && text.trim() ? text : null
}

function toNumberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function toImageList(...sources: unknown[]): string[] {
  const images: string[] = []
  for (const source of sources) {
    if (Array.isArray(source)) {
      for (const entry of source) {
        const url = typeof entry === 'string' ? entry : toOptionalString(toRecord(entry).url)
        if (url) images.push(url)
      }
      continue
    }
    const single = toOptionalString(source)
    if (single) images.push(single)
  }
  return images
}

export function normalizeProductDetail(raw: unknown, fallbackId: string): ProductDetail {
  const source = toRecord(raw)
  return {
    id: toOptionalString(source.id) ?? fallbackId,
    name: toOptionalString(source.name) ?? 'Untitled product',
    description: toOptionalString(source.description),
    price: toNumberValue(source.price) ?? 0,
    images: toImageList(source.images, source.imageUrl),
    stock: Math.max(0, Math.trunc(toNumberValue(source.stock) ?? 0)),
    category: toOptionalString(source.category),
    brand: toOptionalString(source.brand),
    createdAt: toStringValue(source.createdAt),
  }
}

export function normalizeRelatedProducts(raw: unknown): RelatedProduct[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((entry) => toRecord(entry))
    .filter((entry) => Boolean(toOptionalString(entry.id)))
    .map((entry) => ({
      id: toOptionalString(entry.id) as string,
      name: toOptionalString(entry.name) ?? 'Untitled product',
      price: toNumberValue(entry.price) ?? 0,
      imageUrl: toOptionalString(entry.imageUrl) ?? toImageList(entry.images)[0] ?? null,
    }))
}
