import { PartialType } from '@nestjs/mapped-types';
import { CreateProductLikeDto } from './create-product-like.dto';

export class UpdateProductLikeDto extends PartialType(CreateProductLikeDto) {}
