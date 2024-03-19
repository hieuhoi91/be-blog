import { UserEntity } from 'src/modules/users/user.entity';

export class CreatePostDto {
  title: string;

  description: string;

  thumbnail: string;

  user: UserEntity;
}
