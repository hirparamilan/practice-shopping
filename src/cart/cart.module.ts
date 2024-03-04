import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './entities/cart.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
