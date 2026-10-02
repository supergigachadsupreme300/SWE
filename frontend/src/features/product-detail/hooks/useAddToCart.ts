'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AddToCartRequest, AddToCartStatus, UseAddToCartResult } from '../types'

export const ADD_TO_CART_EVENT = 'brewlite:add-to-cart'

export function registerCartBridge(addToCart: (item: AddToCartRequest) => void | Promise<void>): void {
  if (typeof window === 'undefined') return
  window.__BREWLITE_CART__ = { addToCart }
}

export function unregisterCartBridge(): void {
  if (typeof window === 'undefined') return
  delete window.__BREWLITE_CART__
}

function hasCartBridge(): boolean {
  return typeof window !== 'undefined' && typeof window.__BREWLITE_CART__?.addToCart === 'function'
}

async function dispatchAddToCart(item: AddToCartRequest): Promise<boolean> {
  const bridge = typeof window === 'undefined' ? undefined : window.__BREWLITE_CART__
  if (typeof bridge?.addToCart === 'function') {
    await bridge.addToCart(item)
    return true
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<AddToCartRequest>(ADD_TO_CART_EVENT, { detail: item }))
  }
  return false
}

export function useAddToCart(): UseAddToCartResult {
  const [status, setStatus] = useState<AddToCartStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setConnected(hasCartBridge())
  }, [])

  const addToCart = useCallback(async (item: AddToCartRequest) => {
    setStatus('pending')
    setMessage(null)
    try {
      const handled = await dispatchAddToCart(item)
      setConnected(handled || hasCartBridge())
      setStatus(handled ? 'success' : 'unavailable')
      setMessage(
        handled
          ? `${item.quantity} x added to your cart.`
          : 'Add-to-cart dispatched. The cart feature is not connected yet.',
      )
    } catch {
      setStatus('error')
      setMessage('Could not add this item to the cart.')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage(null)
  }, [])

  return { addToCart, status, message, connected, reset }
}
