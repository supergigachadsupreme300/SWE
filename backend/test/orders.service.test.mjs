import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { OrdersService, assertTransition, ALLOWED_TRANSITIONS } = require('../dist/modules/orders/orders.service.js')

describe('Backend OrdersService - Section 9.1 State Machine & Validation Unit Tests', () => {
  it('should define valid transitions according to Section 9.1', () => {
    assert.deepEqual(ALLOWED_TRANSITIONS.PENDING, ['PAID', 'PAYMENT_FAILED', 'CANCELLED'])
    assert.deepEqual(ALLOWED_TRANSITIONS.PAYMENT_FAILED, ['PAID', 'CANCELLED'])
    assert.deepEqual(ALLOWED_TRANSITIONS.PAID, ['PREPARING'])
    assert.deepEqual(ALLOWED_TRANSITIONS.PREPARING, ['READY', 'CANCELLED'])
    assert.deepEqual(ALLOWED_TRANSITIONS.READY, ['COMPLETED'])
    assert.deepEqual(ALLOWED_TRANSITIONS.COMPLETED, [])
    assert.deepEqual(ALLOWED_TRANSITIONS.CANCELLED, [])
  })

  it('should allow valid transitions without throwing', () => {
    assert.doesNotThrow(() => assertTransition('PENDING', 'PAID'))
    assert.doesNotThrow(() => assertTransition('PAID', 'PREPARING'))
    assert.doesNotThrow(() => assertTransition('PREPARING', 'READY'))
    assert.doesNotThrow(() => assertTransition('READY', 'COMPLETED'))
    assert.doesNotThrow(() => assertTransition('PENDING', 'PAYMENT_FAILED'))
    assert.doesNotThrow(() => assertTransition('PAYMENT_FAILED', 'PAID'))
    assert.doesNotThrow(() => assertTransition('PENDING', 'CANCELLED'))
    assert.doesNotThrow(() => assertTransition('PREPARING', 'CANCELLED'))
  })

  it('should throw BadRequestException when transitioning from COMPLETED (terminal state)', () => {
    assert.throws(() => assertTransition('COMPLETED', 'PENDING'), {
      name: 'BadRequestException',
    })
  })

  it('should throw BadRequestException when transitioning from CANCELLED (terminal state)', () => {
    assert.throws(() => assertTransition('CANCELLED', 'PAID'), {
      name: 'BadRequestException',
    })
  })

  it('should throw BadRequestException when skipping PREPARING (PAID -> READY)', () => {
    assert.throws(() => assertTransition('PAID', 'READY'), {
      name: 'BadRequestException',
    })
  })

  it('should throw BadRequestException when creating order with empty items array', async () => {
    const mockPrisma = {}
    const service = new OrdersService(mockPrisma)
    await assert.rejects(
      async () => {
        await service.create({ userId: 'u1', items: [], total: 0 })
      },
      {
        name: 'BadRequestException',
        message: 'Đơn hàng phải có ít nhất 1 sản phẩm.',
      }
    )
  })
})
