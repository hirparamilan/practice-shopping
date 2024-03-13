import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/auth/lib/accessToken.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AccessTokenGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve other user details' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
