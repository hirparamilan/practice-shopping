import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductLikeDto } from './dto/create-product-like.dto';
import { UpdateProductLikeDto } from './dto/update-product-like.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductLike,
  ProductLikeDocument,
} from './entities/product-like.entity';
import { Model } from 'mongoose';
import { ProductDocument } from 'src/products/entities/product.entity';

@Injectable()
export class ProductLikesService {
  constructor(
    @InjectModel(ProductLike.name)
    private productLikeModel: Model<ProductLikeDocument>,
  ) {}

  async create(userId, createProductLikeDto: CreateProductLikeDto) {
    createProductLikeDto.userId = userId;
    const createdProductLike = new this.productLikeModel(createProductLikeDto);
    await createdProductLike.save();

    // const createdProduct = await this.productModel.create(createProductDto);
    return {
      status: HttpStatus.OK,
      message: 'Product Liked Successfully',
      data: createdProductLike,
    };
  }

  async findAll(userId, email) {
    console.log('userId = ' + userId);
    console.log('email = ' + email);
    const data = await this.productLikeModel
      .aggregate([
        { $match: { userId: userId } },
        {
          $lookup: {
            from: 'users', // collection name in db
            let: { userId: '$_id' },
            pipeline: [
              //searching [searchId] value equals your field [_id]
              { $match: { $expr: [{ _id: '$$userId' }] } },
              //projecting only fields you reaaly need, otherwise you will store all - huge data loads
            ],
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'products', // collection name in db
            let: { productId: '$_id' },
            pipeline: [
              //searching [searchId] value equals your field [_id]
              { $match: { $expr: [{ _id: '$$productId' }] } },
              //projecting only fields you reaaly need, otherwise you will store all - huge data loads
            ],
            as: 'product',
          },
        },
        // {
        //   $project: {
        //     'product.name': 1,
        //     'product.description': 1,
        //     'product.category': 1,
        //     'product.amount': 1,
        //     'product.image': 1,
        //   },
        // },
      ])
      .exec();
    return {
      status: HttpStatus.OK,
      data: data,
      message: 'Data retrived successfully',
    };
    return `This action returns all productLikes`;
  }

  async findExact(
    userId: string,
    productId: string,
  ): Promise<ProductLikeDocument> {
    return this.productLikeModel
      .findOne({ userId: userId, productId: productId })
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} productLike`;
  }

  update(id: number, updateProductLikeDto: UpdateProductLikeDto) {
    return `This action updates a #${id} productLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} productLike`;
  }
}
