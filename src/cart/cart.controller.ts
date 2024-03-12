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

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(AccessTokenGuard)
  create(@Req() req, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(req.user.id, createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  @Get('get')
  @UseGuards(AccessTokenGuard)
  findOne(@Req() req) {
    return this.cartService.findOne(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Post('remove')
  @UseGuards(AccessTokenGuard)
  remove(@Req() req, @Body() createCartDto: CreateCartDto) {
    return this.cartService.remove(req.user.id, createCartDto);
  }
}
