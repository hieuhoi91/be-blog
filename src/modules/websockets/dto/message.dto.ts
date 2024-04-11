import { IsString } from 'class-validator';

export class Messsage {
  constructor(user_id: string, post_id: string, message: string) {
    this.user_id = user_id;
    this.post_id = post_id;
    this.message = message;
  }

  @IsString()
  user_id: string;

  @IsString()
  post_id: string;

  @IsString()
  message: string;
}
