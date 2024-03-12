import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class Token {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @Expose()
  @IsString()
  accessToken: string;

  @Expose()
  @IsString()
  refreshToken: string;
}
export class ReqLogin {
  @IsEmail()
  email: string;

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
