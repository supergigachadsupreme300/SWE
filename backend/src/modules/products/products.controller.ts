import { Controller, Get, Param, Query } from '@nestjs/common'
import {
  DEFAULT_RELATED_LIMIT,
  ProductDetailResponse,
  ProductsService,
} from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return { message: 'products endpoint placeholder' }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductDetailResponse> {
    return this.productsService.findOne(id)
  }

  @Get(':id/related')
  findRelated(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ): Promise<ProductDetailResponse[]> {
    return this.productsService.findRelated(id, limit ?? DEFAULT_RELATED_LIMIT)
  }
}
