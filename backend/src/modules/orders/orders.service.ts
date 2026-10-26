import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto, ValidOrderStatus } from './dto/update-order-status.dto'

/**
 * BrewLite Order State Machine (Section 9.1 in Project Specification)
 * Happy path: PENDING -> PAID -> PREPARING -> READY -> COMPLETED
 * Exceptions:
 *  - PENDING -> PAYMENT_FAILED (thanh toán lỗi, có thể thử lại -> PAID hoặc CANCELLED)
 *  - PENDING, PREPARING -> CANCELLED (hủy đơn)
 * Terminal states: COMPLETED, CANCELLED
 */
export const ALLOWED_TRANSITIONS: Record<ValidOrderStatus, ValidOrderStatus[]> = {
  PENDING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
}

export function assertTransition(currentStatus: string, nextStatus: string): void {
  const allowed = (ALLOWED_TRANSITIONS as any)[currentStatus] || []
  if (!allowed.includes(nextStatus)) {
    throw new BadRequestException(
      `Không thể chuyển trạng thái từ "${currentStatus}" sang "${nextStatus}". Chuyển tiếp hợp lệ: [${allowed.join(', ') || 'Trạng thái kết thúc, không thể thay đổi'}].`,
    )
  }
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new order with stock verification and atomic stock decrement within a Prisma transaction.
   * Default state: PENDING
   */
  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, total } = createOrderDto

    if (!items || items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm.')
    }

    // Resolve or fallback to default customer
    let targetUserId = userId
    if (!targetUserId) {
      const firstUser = await this.prisma.user.findFirst()
      if (firstUser) {
        targetUserId = firstUser.id
      } else {
        const demoUser = await this.prisma.user.create({
          data: {
            email: 'customer@brewlite.com',
            name: createOrderDto.customerInfo?.customerName || 'Khách Nhận Tại Quầy',
          },
        })
        targetUserId = demoUser.id
      }
    }

    // Database transaction: Verify stock, create order, deduct stock
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify stock for every item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new NotFoundException(`Sản phẩm mã "${item.productId}" không tồn tại trong hệ thống.`)
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${product.name}" hiện không đủ tồn kho (Còn lại: ${product.stock}, yêu cầu: ${item.quantity}).`,
          )
        }
      }

      // 2. Create Order & OrderItems in PENDING status
      const createdOrder = await tx.order.create({
        data: {
          userId: targetUserId,
          total: total,
          status: 'PENDING',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size || null,
              toppings: Array.isArray(item.toppings) ? item.toppings.join(',') : item.toppings || null,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal ?? item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      })

      // 3. Deduct stock for each product atomically
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return createdOrder
    })
  }

  /**
   * Retrieves order details by ID
   */
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        payments: true,
      },
    })

    if (!order) {
      throw new NotFoundException(`Đơn hàng #${id} không tồn tại.`)
    }

    return order
  }

  /**
   * Updates order status with strict lifecycle transition validation using assertTransition
   */
  async updateStatus(id: string, updateDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } })
    if (!order) {
      throw new NotFoundException(`Đơn hàng #${id} không tồn tại.`)
    }

    const currentStatus = order.status
    const nextStatus = updateDto.status

    // Assert state machine transition
    assertTransition(currentStatus, nextStatus)

    return this.prisma.order.update({
      where: { id },
      data: { status: nextStatus },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  /**
   * Lists orders for a user or all orders
   */
  async findAll(userId?: string) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
