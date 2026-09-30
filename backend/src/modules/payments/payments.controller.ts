import { Controller, Get } from '@nestjs/common'

@Controller('payments')
export class PaymentsController {
  @Get()
  ping() {
    return { message: 'payments placeholder' }
  }
}
