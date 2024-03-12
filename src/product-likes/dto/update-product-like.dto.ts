import { PartialType } from '@nestjs/mapped-types';
import { ProductLikeDto } from './create-product-like.dto';

export class UpdateProductLikeDto extends PartialType(ProductLikeDto) {}
