import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AccessTokenGuard } from 'src/auth/lib/accessToken.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add to cart' })
  @Post('add')
  @UseGuards(AccessTokenGuard)
  create(@Req() req, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(req.user.id, createCartDto);
  }

  // @ApiOperation({ summary: "Get all carts" })
  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  @ApiOperation({ summary: "Get current user's cart" })
  @Get('get')
  @UseGuards(AccessTokenGuard)
  findOne(@Req() req) {
    return this.cartService.findOne(req.user.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }

  @ApiOperation({ summary: 'Remove from cart' })
  @Post('remove')
  @UseGuards(AccessTokenGuard)
  remove(@Req() req, @Body() createCartDto: CreateCartDto) {
    return this.cartService.remove(req.user.id, createCartDto);
  }
}
