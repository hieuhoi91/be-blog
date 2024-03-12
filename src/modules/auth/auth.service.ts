import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserRes } from '../users/dtos/create-user';
import { UsersEntity } from '../users/user.entity';
import { ReqLogin } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser({ email, password }: ReqLogin) {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    if (user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return null;
  }

  async login(user: CreateUserRes) {
    const payload = { user };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refeshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }
}
