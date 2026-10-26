
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processPayment(dto: CreatePaymentDto) {
    const existingPayment = await this.prisma.payment.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    })

    if (existingPayment) {
      if (
        existingPayment.orderId !== dto.orderId ||
        existingPayment.method !== dto.method
      ) {
        throw new ConflictException(
          'Idempotency key was already used for another payment',
        )
      }

      return existingPayment
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (!Number.isFinite(order.total) || order.total <= 0) {
      throw new BadRequestException('Order total must be greater than zero')
    }

    if (!['PENDING', 'PAYMENT_FAILED'].includes(order.status)) {
      throw new ConflictException(
        `Order cannot be paid when status is ${order.status}`,
      )
    }

    const mockSuccess = !dto.idempotencyKey.startsWith('fail-')

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          method: dto.method,
          status: 'PENDING',
          idempotencyKey: dto.idempotencyKey,
        },
      })

      const paymentStatus = mockSuccess ? 'SUCCESS' : 'FAILED'
      const orderStatus = mockSuccess ? 'PAID' : 'PAYMENT_FAILED'

      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: { status: paymentStatus },
      })

      await tx.order.update({
        where: { id: order.id },
        data: { status: orderStatus },
      })

      return {
        paymentId: updatedPayment.id,
        orderId: order.id,
        amount: updatedPayment.amount,
        method: updatedPayment.method,
        paymentStatus,
        orderStatus,
        message: mockSuccess
          ? 'Payment successful'
          : 'Payment failed. Please try again.',
      }
    })
  }
}
