import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserReq, CreateUserRes } from '../users/dto/create-user';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { ReqLogin, ResLogin, Token } from './dto/auth.dto';
import { UserEntity } from '../users/user.entity';
import { LocalAuthGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Serialize(CreateUserRes)
  @Post('register')
  async createUser(@Body() req: CreateUserReq): Promise<UserEntity> {
    const users = await this.authService.register(req);
    return users;
  }

  @Serialize(ResLogin)
  @Post('login')
  async login(@Body() authPayload: ReqLogin): Promise<ResLogin> {
    const user = await this.authService.login(authPayload);

    return new ResLogin(
      user.id,
      user.username,
      new Token(
        user.token.accessToken,
        user.token.refreshToken,
        user.token.expiresIn,
      ),
    );
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() { refresh_token }: { refresh_token: string },
  ): Promise<any> {
    return await this.authService.refreshToken(refresh_token);
  }
}
