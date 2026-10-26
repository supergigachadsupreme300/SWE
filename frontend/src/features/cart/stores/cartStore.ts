'use client'

import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

import type {
  AddToCartDTO,
  CartActionResult,
  CartItem,
} from '../types'

import {
  validateAddToCart,
  validateCartQuantity,
} from '../utils/cartValidation'

type ProductForCart = {
  productId: string
  name: string
  unitPrice: number
  stock: number
  imageUrl?: string | null
}

type CartState = {
  items: CartItem[]

  addItem: (
    product: ProductForCart,
    input: AddToCartDTO,
  ) => CartActionResult

  updateQuantity: (
    productId: string,
    quantity: number,
  ) => CartActionResult

  removeItem: (productId: string) => void
  clearCart: () => void

  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Thêm sản phẩm vào giỏ hàng
      addItem: (product, input) => {
        const validationMessage = validateAddToCart(
          input,
          product.stock,
        )

        if (validationMessage) {
          return {
            success: false,
            message: validationMessage,
          }
        }

        if (
          !Number.isFinite(product.unitPrice) ||
          product.unitPrice < 0
        ) {
          return {
            success: false,
            message: 'Giá sản phẩm không hợp lệ.',
          }
        }

        if (
          !product.name?.trim() ||
          product.productId !== input.productId
        ) {
          return {
            success: false,
            message: 'Thông tin sản phẩm không hợp lệ.',
          }
        }

        const current = get().items.find(
          (item) =>
            item.productId === input.productId &&
            item.size === input.size &&
            JSON.stringify(item.toppings ?? []) === JSON.stringify(input.toppings ?? []),
        )

        const nextQuantity =
          (current?.quantity ?? 0) + input.quantity

        // Kiểm tra cả số lượng đã có trong giỏ
        if (nextQuantity > product.stock) {
          return {
            success: false,
            message: `Trong giỏ đã có ${
              current?.quantity ?? 0
            }; tồn kho chỉ còn ${product.stock}.`,
          }
        }

        if (current) {
          // Nếu đã có sản phẩm thì cộng số lượng
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === input.productId
                ? {
                    ...item,
                    quantity: nextQuantity,
                    stock: product.stock,
                    unitPrice: typeof input.unitPrice === 'number' ? input.unitPrice : product.unitPrice,
                    name: product.name,
                    imageUrl: product.imageUrl ?? null,
                    size: input.size,
                    toppings: input.toppings,
                  }
                : item,
            ),
          }))
        } else {
          // Nếu chưa có thì thêm dòng sản phẩm mới
          set((state) => ({
            items: [
              ...state.items,
              {
                productId: product.productId,
                name: product.name,
                unitPrice: typeof input.unitPrice === 'number' ? input.unitPrice : product.unitPrice,
                stock: product.stock,
                quantity: input.quantity,
                imageUrl: product.imageUrl ?? null,
                size: input.size,
                toppings: input.toppings,
              },
            ],
          }))
        }

        return {
          success: true,
          message: 'Đã thêm sản phẩm vào giỏ hàng.',
        }
      },

      // Cập nhật số lượng sản phẩm
      updateQuantity: (productId, quantity) => {
        const item = get().items.find(
          (entry) => entry.productId === productId,
        )

        if (!item) {
          return {
            success: false,
            message: 'Không tìm thấy sản phẩm trong giỏ.',
          }
        }

        const validationMessage = validateCartQuantity(
          quantity,
          item,
        )

        if (validationMessage) {
          return {
            success: false,
            message: validationMessage,
          }
        }

        set((state) => ({
          items: state.items.map((entry) =>
            entry.productId === productId
              ? { ...entry, quantity }
              : entry,
          ),
        }))

        return {
          success: true,
          message: 'Đã cập nhật số lượng.',
        }
      },

      // Xóa một sản phẩm
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId,
          ),
        }))
      },

      // Xóa toàn bộ giỏ hàng
      clearCart: () => {
        set({ items: [] })
      },

      // Tổng số đơn vị sản phẩm trong giỏ
      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0,
        )
      },

      // Tổng tiền = đơn giá × số lượng
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.unitPrice * item.quantity,
          0,
        )
      },
    }),
    {
      name: 'brewlite-cart',
      storage: createJSONStorage(() => localStorage),

      // Chủ động khôi phục dữ liệu phía trình duyệt
      // để hạn chế lỗi hydration của Next.js
      skipHydration: true,
    },
  ),
)