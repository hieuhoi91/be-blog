import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Token {
  constructor(accessToken: string, refreshToken: string, expiresIn: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }

  @Expose()
  @IsString()
  accessToken: string;

  @Expose()
  @IsString()
  refreshToken: string;

  @Expose()
  @IsString()
  expiresIn: string;
}

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class ReqLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ResLogin {
  constructor(id: string, username: string, token: Token) {
    this.id = id;
    this.username = username;
    this.token = token;
  }

  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  token: Token;
}
