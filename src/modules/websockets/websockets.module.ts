import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { CommentsService } from '../comments/comments.service';
import { CommentEntity } from '../comments/comment.entity';

@Module({
  providers: [ChatGateway, AuthService, CommentsService],
  imports: [TypeOrmModule.forFeature([UserEntity, CommentEntity])],
})
export class WebsocketsModule {}
