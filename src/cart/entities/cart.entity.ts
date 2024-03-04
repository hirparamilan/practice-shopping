import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  // @Prop({ type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  // productIds: string[];
  products: [
    {
      productId: string;
      quantity: number;
    },
  ];

  @Prop()
  cartAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
