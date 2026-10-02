import { Injectable, NotFoundException } from '@nestjs/common'
import type { Product } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

export const DEFAULT_RELATED_LIMIT = 4
export const MAX_RELATED_LIMIT = 12

export const PRODUCT_DETAIL_SELECT = {
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  price: true,
  stock: true,
  createdAt: true,
} as const

export type ProductDetailResponse = Pick<Product, keyof typeof PRODUCT_DETAIL_SELECT>

export function clampRelatedLimit(value: number | string | undefined): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) return DEFAULT_RELATED_LIMIT
  return Math.min(MAX_RELATED_LIMIT, Math.max(1, Math.trunc(parsed)))
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<ProductDetailResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: PRODUCT_DETAIL_SELECT,
    })

    if (!product) {
      throw new NotFoundException(`Product "${id}" was not found`)
    }

    return product
  }

  async findRelated(id: string, limit?: number | string): Promise<ProductDetailResponse[]> {
    const product = await this.prisma.product.findUnique({ where: { id }, select: { id: true } })

    if (!product) {
      throw new NotFoundException(`Product "${id}" was not found`)
    }

    return this.prisma.product.findMany({
      where: { id: { not: id } },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: clampRelatedLimit(limit),
      select: PRODUCT_DETAIL_SELECT,
    })
  }
}
