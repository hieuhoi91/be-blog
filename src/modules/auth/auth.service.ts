import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { RegisterUserDto, ReqLogin, ResLogin } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(resgisterUser: RegisterUserDto): Promise<UserEntity> {
    const findUser = await this.userRepository.findOneBy({
      email: resgisterUser.email,
    });

    if (findUser) {
      throw new ConflictException(`Email already exists`);
    }

    const hashPassword = await this.hashPassword(resgisterUser.password);
    return await this.userRepository.save({
      ...resgisterUser,
      role: resgisterUser.role,
      avartar: resgisterUser.avatar,
      refresh_token: 'refresh_token_string',
      password: hashPassword,
    });
  }

  async authentication(reqLogin: ReqLogin): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: reqLogin.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(reqLogin.password, user.password);
    if (!checkPass) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(reqLogin: ReqLogin): Promise<ResLogin> {
    const user = await this.authentication(reqLogin);
    //generate access token and refresh token
    const payload = { id: user.id, email: user.email };
    const token = await this.generateToken(payload);

    return { ...user, token };
  }

  private async generateToken(payload: { id: string; email: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET_KEY'),
      expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET_KEY'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
    });

    await this.userRepository.update(
      { email: payload.email },
      { refreshToken: refreshToken },
    );

    return { accessToken, refreshToken, expiresIn: '1h' };
  }

  async handleVerifyToken(
    token: string,
  ): Promise<{ id: string; email: string }> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });
      return payload;
    } catch (error) {
      throw new HttpException({ message: 'Invalid' }, HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });

      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refreshToken: verify.refresh_token,
      });

      if (checkExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
