import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  // @Prop({ type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
