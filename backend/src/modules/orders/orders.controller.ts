import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMine(@Req() req: any) {
    return this.ordersService.findAll(req.user?.id)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateDto)
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll()
  }
}
