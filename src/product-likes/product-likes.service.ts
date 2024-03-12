import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductLikeDto } from './dto/create-product-like.dto';
import { UpdateProductLikeDto } from './dto/update-product-like.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductLike,
  ProductLikeDocument,
} from './entities/product-like.entity';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/entities/product.entity';

@Injectable()
export class ProductLikesService {
  constructor(
    @InjectModel(ProductLike.name)
    private productLikeModel: Model<ProductLikeDocument>,

    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(userId, productLikeDto) {
    var productLike = await this.productLikeModel.findOne({
      userId: userId,
      productId: productLikeDto.productId,
    });

    if (productLike) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Product already liked',
      };
    }

    productLikeDto.userId = userId;
    const createdProductLike = new this.productLikeModel(productLikeDto);
    await createdProductLike.save();

    await this.productModel
      .findByIdAndUpdate(productLikeDto.productId, { $inc: { likes: 1 } })
      .exec();

    // var product = await this.productModel.findById(
    //   productLikeDto.productId,
    // );
    // product.likes += 1;
    // await this.productModel
    //   .findByIdAndUpdate(productLikeDto.productId, {product})
    //   .exec();

    // const createdProduct = await this.productModel.create(createProductDto);
    return {
      status: HttpStatus.OK,
      message: 'Product Liked Successfully',
      data: createdProductLike,
    };
  }

  async findAll(usrId, email) {
    console.log('userId = ' + usrId);
    console.log('email = ' + email);
    const data = await this.productLikeModel
      .aggregate([
        { $match: { userId: usrId } },
        {
          $lookup: {
            from: 'users', // collection name in db
            let: { uId: '$userId' },
            pipeline: [
              //searching [searchId] value equals your field [_id]
              // { $match: { $expr: [{ _id: { $toObjectId: '$$uId' } }] } },
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$_id', { $toObjectId: '$$uId' }] }],
                  },
                },
              },
              //projecting only fields you reaaly need, otherwise you will store all - huge data loads
            ],
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'products', // collection name in db
            let: { pId: '$productId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$_id', { $toObjectId: '$$pId' }] }],
                  },
                },
              },
            ],
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            productId: 1,
            // user: 1,
            // product: 1,
            user: {
              name: 1,
              email: 1,
            },
            product: {
              name: 1,
              description: 1,
              category: 1,
              amount: 1,
              image: 1,
            },
          },
        },
      ])
      .exec();
    return {
      status: HttpStatus.OK,
      data: data,
      message: 'Data retrived successfully',
    };
    // return `This action returns all productLikes`;
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

  async remove(userId, productLikeDto) {
    console.log('userId : ' + userId);
    console.log('productId : ' + productLikeDto.productId);

    var productLike = await this.productLikeModel.findOne({
      userId: userId,
      productId: productLikeDto.productId,
    });

    if (!productLike) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Product not liked',
      };
    }

    await this.productLikeModel.findByIdAndDelete(productLike._id).exec();

    await this.productModel
      .findByIdAndUpdate(productLikeDto.productId, { $inc: { likes: -1 } })
      .exec();

    return {
      status: HttpStatus.OK,
      message: 'Product DisLiked Successfully',
    };
  }
}
