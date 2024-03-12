import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
// import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    // private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(email, password, name): Promise<any> {
    console.log('email = ' + email);
    console.log('password = ' + password);
    console.log('name = ' + name);

    // Check if user exists
    var user = await this.userModel.findOne({ email });
    // const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (user) {
      return { status: HttpStatus.BAD_REQUEST, message: 'User already exists' };
    }

    // Hash password
    const hashedPwd = await this.hashData(password);
    console.log('working..1');

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPwd;
    newUser.name = name;
    console.log('working..1.2');
    const savedUser = await this.userModel.create(newUser);
    console.log('working..2');
    const saveUser = await savedUser.save();
    console.log('working..3');
    return {
      status: HttpStatus.OK,
      message: 'user registered successfully',
      data: { _id: saveUser._id, email: saveUser.email },
    };

    // const newUser = await this.usersService.create({
    //   ...createUserDto,
    //   password: hash,
    // });
    // const tokens = await this.getTokens(newUser);
    // await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    // return {
    //   status: HttpStatus.OK,
    //   message: 'User created Successfully',
    //   data: newUser,
    //   accessToken: tokens.accessToken,
    //   refreshToken: tokens.refreshToken,
    // };
    // return tokens;
  }

  async signIn(email, password) {
    var user = await this.userModel.findOne({ email });
    if (!user) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'User not found',
      };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      };
    }
    const tokens = await this.getTokens(user);
    user.refreshToken = tokens.refreshToken;
    await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .exec();
    // await this.updateRefreshToken(user._id, tokens.refreshToken);
    return {
      status: HttpStatus.OK,
      message: 'logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken: tokens.accessToken,
        refreshToken: user.refreshToken,
      },
    };
    return tokens;
  }

  async logout(userId: string, response: Response) {
    await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
    // await this.usersService.update(userId, { refreshToken: null });
    return response.json({
      statusCode: HttpStatus.OK,
      message: 'User loggedout successfully',
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
    // return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userModel.updateOne(
      { _id: userId },
      { refreshToken: hashedRefreshToken },
    );

    // await this.usersService.update(userId, {
    //   refreshToken: hashedRefreshToken,
    // });
  }

  async getTokens(user: User) {
    const payload = {
      id: user._id,
      email: user.email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '60m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
