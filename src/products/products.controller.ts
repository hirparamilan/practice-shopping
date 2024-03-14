import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  HttpStatus,
  ParseFilePipeBuilder,
  Request,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AccessTokenGuard } from 'src/auth/lib/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { upload } from 'src/upload';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AccessTokenGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      // storage: diskStorage({
      //   destination: './uploads',
      //   filename: (req, file, cb) => {
      //     cb(null, file.originalname);
      //   },
      // }),
      storage: upload,
    }),
  )
  @ApiOperation({ summary: 'Add product' })
  @Post('create')
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 2, // 2 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get('get-products')
  findAll(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    // console.log('req user sub = ' + req.user.id);
    // console.log('req user email = ' + req.user.email);
    return this.productsService.findAll(req.user.id, page, limit);
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update product by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
