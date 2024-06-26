import { IsString } from 'class-validator';
import { UserEntity } from 'src/modules/users/user.entity';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail_url: string;

  @IsString()
  category_id: string;
}
