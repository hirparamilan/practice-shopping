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
import { ProductLikeDto } from './dto/create-product-like.dto';
import { UpdateProductLikeDto } from './dto/update-product-like.dto';
import { AccessTokenGuard } from 'src/auth/lib/accessToken.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('product-likes')
@Controller('product-likes')
export class ProductLikesController {
  constructor(private readonly productLikesService: ProductLikesService) {}

  @ApiOperation({ summary: 'Like product' })
  @Post('create')
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() productLikeDto: ProductLikeDto) {
    return this.productLikesService.create(req.user.id, productLikeDto);
  }

  // @ApiOperation({ summary: 'Get all products' })
  // @Get()
  // @UseGuards(AccessTokenGuard)
  // findAll(@Request() req) {
  //   return this.productLikesService.findAll(req.user.id, req.user.email);
  // }

  // @ApiOperation({ summary: 'Get single product from id' })
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productLikesService.findOne(+id);
  // }

  // @ApiOperation({ summary: 'Update product from id' })
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateProductLikeDto: UpdateProductLikeDto,
  // ) {
  //   return this.productLikesService.update(+id, updateProductLikeDto);
  // }

  @ApiOperation({ summary: 'Dislike product' })
  // @Delete(':id')
  @Post('remove')
  @UseGuards(AccessTokenGuard)
  remove(@Request() req, @Body() productLikeDto: ProductLikeDto) {
    return this.productLikesService.remove(req.user.id, productLikeDto);
  }
}
