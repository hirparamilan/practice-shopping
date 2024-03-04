import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './entities/cart.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,

    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(userId, createCartDto: CreateCartDto) {
    // console.log('productId = ' + createCartDto.productId);

    var resultCart;
    var cart = await this.cartModel.findOne({ userId: userId });
    const product = await this.productModel.findOne({
      _id: createCartDto.productId,
    });
    if (cart) {
      // console.log('cart exist');
      // console.log('productIds = ' + cart.productIds);

      let indexToUpdate = cart.products.findIndex(
        (product) => product.productId === createCartDto.productId,
      );

      console.log('indexToUpdate = ' + indexToUpdate);
      if (indexToUpdate == -1) {
        var productObj = {
          productId: createCartDto.productId,
          quantity: createCartDto.quantity,
        };
        cart.products.push(productObj);
        cart.cartAmount += product.amount * createCartDto.quantity;

        resultCart = await this.cartModel.findOneAndUpdate(
          { _id: cart._id },
          {
            $set: {
              // productIds: cart.productIds,
              products: cart.products,
              cartAmount: cart.cartAmount,
            },
          },
          {
            new: true,
          },
        );
      } else {
        const foundProduct = cart.products[indexToUpdate];
        // const foundProduct = cart.products.find(
        //   (productId) => createCartDto.productId,
        // );
        // console.log(
        //   'found cart : productId = ' +
        //     foundProduct.productId +
        //     ' Quantity = ' +
        //     foundProduct.quantity,
        // );

        // if (cart.products.find((productId) => createCartDto.productId)) {
        // if (cart.productIds.includes(createCartDto.productId)) {
        var productObj = {
          productId: createCartDto.productId,
          quantity: foundProduct.quantity + createCartDto.quantity,
        };

        cart.products[indexToUpdate] = productObj;
        cart.cartAmount += product.amount * createCartDto.quantity;
        // console.log(JSON.stringify(cart.products));
        // console.info('cart products = ' + cart.products);

        resultCart = await this.cartModel.findOneAndUpdate(
          { _id: cart._id },
          {
            $set: {
              // productIds: cart.productIds,
              products: cart.products,
              cartAmount: cart.cartAmount,
            },
          },
          {
            new: true,
          },
        );
      }
      // return {
      //   status: HttpStatus.BAD_REQUEST,
      //   message: 'Product already exists in the cart',
      // };
      // } else {
      //   // cart.productIds.push(createCartDto.productId);
      //   cart.cartAmount += product.amount;
      //   // console.log('productIds after update = ' + cart.productIds);
      //   // console.log('productId = ' + createCartDto.productId);
      //   // console.log('cart exist');

      //   resultCart = await this.cartModel.findOneAndUpdate(
      //     { _id: cart._id },
      //     {
      //       $set: {
      //         // productIds: cart.productIds,
      //         cartAmount: cart.cartAmount,
      //       },
      //     },
      //     {
      //       new: true,
      //     },
      //   );
      // }
    } else {
      // console.log('cart not exist');

      // createCartDto.userId = userId;
      // console.log('productId = ' + createCartDto.productId);
      // createCartDto.productIds = [];
      // createCartDto.productIds.push(createCartDto.productId);
      // createCartDto.products = [];

      var products = [];
      var productObj = {
        productId: createCartDto.productId,
        quantity: createCartDto.quantity,
      };
      products.push(productObj);

      // resultCart = new this.cartModel(createCartDto);

      resultCart = new this.cartModel({
        userId: userId,
        products: products,
        quantity: createCartDto.quantity,
      });

      resultCart.cartAmount = product.amount * productObj.quantity;
      await resultCart.save();
    }

    return {
      status: HttpStatus.OK,
      message: 'Product successfully added to the cart',
      // product: product,
      data: resultCart,
    };
  }

  findAll() {
    return `This action returns all cart`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} cart`;
  // }

  async findOne(userId) {
    console.log('userId = ' + userId);
    var cart = await this.cartModel.findOne({ userId: userId });
    return {
      status: HttpStatus.OK,
      message: 'Cart fetched successfully',
      data: cart,
    };
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(userId, createCartDto: CreateCartDto) {
    // console.log('productId = ' + createCartDto.productId);
    var cart = await this.cartModel.findOne({ userId: userId });

    if (cart) {
      // console.log('productIds before splice = ' + cart.productIds);
      // console.log(
      //   'Index of product = ' +
      //     cart.productIds.indexOf(createCartDto.productId),
      // );
      let indexToUpdate = cart.products.findIndex(
        (product) => product.productId === createCartDto.productId,
      );

      // console.log('indexToUpdate = ' + indexToUpdate);

      const foundProduct = cart.products[indexToUpdate];

      if (indexToUpdate != -1) {
        // cart.productIds.splice(
        //   cart.productIds.indexOf(createCartDto.productId),
        //   1,
        // );

        if (foundProduct.quantity == 0) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Product has no quantity to remove',
          };
        } else {
          foundProduct.quantity -= createCartDto.quantity;
          if (foundProduct.quantity < 0) foundProduct.quantity = 0;

          // console.log('productIds after splice = ' + cart.productIds);
          var resultCart;
          const product = await this.productModel.findOne({
            _id: createCartDto.productId,
          });
          cart.cartAmount -= product.amount * createCartDto.quantity;
          cart.products[indexToUpdate] = foundProduct;

          resultCart = await this.cartModel.findOneAndUpdate(
            { _id: cart._id },
            {
              $set: {
                products: cart.products,
                cartAmount: cart.cartAmount,
                // product: product,
                data: resultCart,
              },
            },
            {
              new: true,
            },
          );
          return {
            status: HttpStatus.OK,
            message: 'Product successfully removed from the cart',
            data: resultCart,
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Product not found in the cart',
        };
      }

      // if (cart.productIds.includes(createCartDto.productId)) {
      //   cart.productIds.splice(
      //     cart.productIds.indexOf(createCartDto.productId),
      //     1,
      //   );
      //   // console.log('productIds after splice = ' + cart.productIds);
      //   var resultCart;
      //   const product = await this.productModel.findOne({
      //     _id: createCartDto.productId,
      //   });
      //   cart.cartAmount -= product.amount;
      //   resultCart = await this.cartModel.findOneAndUpdate(
      //     { _id: cart._id },
      //     {
      //       $set: {
      //         productIds: cart.productIds,
      //         cartAmount: cart.cartAmount,
      //         // product: product,
      //         data: resultCart,
      //       },
      //     },
      //     {
      //       new: true,
      //     },
      //   );
      //   return {
      //     status: HttpStatus.OK,
      //     message: 'Product successfully removed from the cart',
      //     data: resultCart,
      //   };
      // } else {
      //   return {
      //     status: HttpStatus.BAD_REQUEST,
      //     message: 'Product not found in the cart',
      //   };
      // }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Cart not found for this user',
      };
    }
  }
}
