import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductLikesService } from './product-likes.service';
import { CreateProductLikeDto } from './dto/create-product-like.dto';
import { UpdateProductLikeDto } from './dto/update-product-like.dto';
import { AccessTokenGuard } from 'src/auth/lib/accessToken.guard';

@Controller('product-likes')
export class ProductLikesController {
  constructor(private readonly productLikesService: ProductLikesService) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() createProductLikeDto: CreateProductLikeDto) {
    return this.productLikesService.create(req.user.sub, createProductLikeDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(@Request() req) {
    return this.productLikesService.findAll(req.user.sub, req.user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLikesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductLikeDto: UpdateProductLikeDto,
  ) {
    return this.productLikesService.update(+id, updateProductLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productLikesService.remove(+id);
  }
}
