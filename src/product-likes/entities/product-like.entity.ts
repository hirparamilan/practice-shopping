import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

export type ProductLikeDocument = ProductLike & Document;

@Schema()
export class ProductLike {
  // @Prop({ type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  // @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // userId: User;

  // @Prop({
  //   required: true,
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Product',
  // })
  // productId: Product;
}

export const ProductLikeSchema = SchemaFactory.createForClass(ProductLike);
