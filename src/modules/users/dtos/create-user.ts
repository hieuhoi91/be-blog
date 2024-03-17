import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserReq {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CreateUserRes {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  avatar: string;
}
