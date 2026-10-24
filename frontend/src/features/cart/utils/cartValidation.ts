import type { AddToCartDTO, CartItem } from '../types'

export function validateAddToCart(
  input: AddToCartDTO,
  stock: number,
): string | null {
  if (!input.productId?.trim()) {
    return 'Không tìm thấy mã sản phẩm.'
  }

  if (
    !Number.isSafeInteger(input.quantity) ||
    input.quantity < 1
  ) {
    return 'Số lượng phải là số nguyên lớn hơn 0.'
  }

  if (!Number.isSafeInteger(stock) || stock < 0) {
    return 'Số lượng tồn kho không hợp lệ.'
  }

  if (stock === 0) {
    return 'Sản phẩm đã hết hàng.'
  }

  if (input.quantity > stock) {
    return `Chỉ còn ${stock} sản phẩm trong kho.`
  }

  return null
}

export function validateCartQuantity(
  quantity: number,
  item: CartItem,
): string | null {
  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 1
  ) {
    return 'Số lượng phải là số nguyên lớn hơn 0.'
  }

  if (quantity > item.stock) {
    return `Số lượng không được vượt quá tồn kho (${item.stock}).`
  }

  return null
}