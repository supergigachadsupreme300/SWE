'use client'

import { useEffect } from 'react'

import {
  fetchProductDetail,
} from '../../product-detail/services/productDetailService'

import {
  registerCartBridge,
  unregisterCartBridge,
} from '../../product-detail/hooks/useAddToCart'

import type {
  AddToCartRequest,
} from '../../product-detail/types'

import { useCartStore } from '../stores/cartStore'

type CartProviderProps = {
  children: React.ReactNode
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const addItem = useCartStore(
    (state) => state.addItem,
  )

  useEffect(() => {
    // Khôi phục giỏ hàng đã lưu trong localStorage
    void useCartStore.persist.rehydrate()

    // Đăng ký cầu nối với Product Detail
    const handleAddToCart = async (
      request: AddToCartRequest,
    ) => {
      const product = await fetchProductDetail(
        request.productId,
      )

      const result = addItem(
        {
          productId: product.id,
          name: product.name,
          unitPrice: request.unitPrice ?? product.price,
          stock: product.stock,
          imageUrl: product.images[0] ?? null,
        },
        request,
      )

      if (!result.success) {
        throw new Error(result.message)
      }
    }

    registerCartBridge(handleAddToCart)

    return () => {
      unregisterCartBridge()
    }
  }, [addItem])

  return <>{children}</>
}