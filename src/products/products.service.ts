import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    // console.log('file path = ' + file.path);
    // console.log('file name = ' + file.filename);
    // console.log('global file path = ' + process.env.FILE_PATH);
    // console.log('image path = ' + process.env.FILE_PATH + file.filename);

    createProductDto.image = process.env.FILE_PATH + file.filename;

    const productName = createProductDto.name;
    // console.log('productName = ' + productName);
    var product = await this.findByName(productName);
    if (product) {
      console.log('product = ' + product);
      const fs = require('fs');
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
        else console.log('File deleted:', file.filename);
      });

      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Product already exist',
      };
    }

    const createdProduct = new this.productModel(createProductDto);
    createdProduct.save();

    // const createdProduct = await this.productModel.create(createProductDto);
    return {
      status: HttpStatus.OK,
      message: 'Product created Successfully',
      data: createdProduct,
    };
  }

  async findAll(userId: string) {
    const allProducts = await this.productModel
      .aggregate([
        {
          $lookup: {
            from: 'productlikes',
            let: {
              pId: '$_id',
              uId: userId,
            }, // collection name in db
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      // { $eq: [{ $toObjectId: '$productId' }, '$$pId'] },
                      { $eq: ['$productId', { $toString: '$$pId' }] },
                      { $eq: ['$userId', '$$uId'] },
                    ],
                  },
                },
              },
            ],
            as: 'likes',
          },

          // $lookup: {
          //   from: 'productlikes',
          //   let: {
          //     productId: '$_id',
          //     userId: { $toObjectId: userId },
          //   },
          //   pipeline: [
          //     {
          //       $match: {
          //         $expr: {
          //           $and: [
          //             { $eq: ['$productId', '$$productId'] },
          //             { $eq: ['$userId', '$$userId'] },
          //           ],
          //         },
          //       },
          //     },
          //   ],
          //   as: 'likes',
          // },
        },
        // {
        //   $addFields: {
        //     isliked: {
        //       $cond: {
        //         if: { $gt: [{ $size: '$likes' }, 0] },
        //         then: true,
        //         else: false,
        //       },
        //     },
        //   },
        // },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            category: 1,
            amount: 1,
            image: 1,
            // likes: 1,
            // isliked: 1,
            isliked: {
              $cond: {
                if: { $gt: [{ $size: '$likes' }, 0] },
                then: true,
                else: false,
              },
            },
          },
        },
      ])
      .exec();

    return {
      status: HttpStatus.OK,
      data: allProducts,
    };
  }

  async findByName(name: string): Promise<ProductDocument> {
    return this.productModel.findOne({ name }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
