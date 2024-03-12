import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local.guard';
import { CreateUserReq, CreateUserRes } from '../users/dtos/create-user';
import { UsersService } from '../users/users.service';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { SimpleResponse } from 'src/common/dto/page.dto';
import { ReqLogin, ResLogin, Token } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Serialize(ResLogin)
  @Post('login')
  async login(@Body() authPayload: ReqLogin) {
    const user = await this.authService.validateUser(authPayload);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.authService.login(user);

    return new ResLogin(
      token.id,
      token.username,
      new Token(token.accessToken, token.refeshToken),
    );
  }

  @Serialize(CreateUserRes)
  @Post('register')
  async createUser(@Body() req: CreateUserReq) {
    const users = await this.usersService.createUser(req);
    return users;
  }
}
