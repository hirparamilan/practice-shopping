import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
// import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from 'src/auth/lib/accessToken.guard';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create user account with email' })
  @Post('signup')
  signup(
    @Query('Email') email: string,
    @Query('Password') password: string,
    @Query('Name') name: string,
  ) {
    return this.authService.signUp(email, password, name);
  }

  @ApiOperation({ summary: 'Login user with email' })
  @Post('signin')
  signin(@Query('Email') email: string, @Query('Password') password: string) {
    return this.authService.signIn(email, password);
  }

  @ApiOperation({ summary: 'Logout user' })
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() response: Response) {
    this.authService.logout(req.user['id'], response);
  }
}
