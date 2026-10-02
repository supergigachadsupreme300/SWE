'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchProductDetail, fetchRelatedProducts } from '../services'
import type { ProductDetail, RelatedProduct, UseProductDetailOptions, UseProductDetailResult } from '../types'

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Unable to load this product right now.'
}

export function useProductDetail(
  id: string | undefined,
  options: UseProductDetailOptions = {},
): UseProductDetailResult {
  const { relatedLimit = 4 } = options
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  const reload = useCallback(() => setRequestKey((key) => key + 1), [])

  useEffect(() => {
    if (!id) {
      setProduct(null)
      setRelatedProducts([])
      setLoading(false)
      setError('Missing product id.')
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    fetchProductDetail(id)
      .then((data) => {
        if (!active) return
        setProduct(data)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setProduct(null)
        setError(toErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    fetchRelatedProducts(id, relatedLimit)
      .then((related) => {
        if (active) setRelatedProducts(related)
      })
      .catch(() => {
        if (active) setRelatedProducts([])
      })

    return () => {
      active = false
    }
  }, [id, relatedLimit, requestKey])

  return { product, relatedProducts, loading, error, reload }
}
