import { Module } from '@nestjs/common';
import { ProductLikesService } from './product-likes.service';
import { ProductLikesController } from './product-likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductLike, ProductLikeSchema } from './entities/product-like.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductLike.name, schema: ProductLikeSchema },
    ]),
  ],
  controllers: [ProductLikesController],
  providers: [ProductLikesService],
})
export class ProductLikesModule {}
