import { Controller, Get } from '@nestjs/common'

@Controller('orders')
export class OrdersController {
  @Get()
  ping() {
    return { message: 'orders placeholder' }
  }
}
