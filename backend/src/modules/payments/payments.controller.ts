
import { Body, Controller, Get, Post } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  ping() {
    return { message: 'payments module is running' }
  }

  @Post()
  processPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.processPayment(dto)
  }
}
