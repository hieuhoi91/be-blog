import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../posts/post.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, CommentEntity, UserEntity])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
