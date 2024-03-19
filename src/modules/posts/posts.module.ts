import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), ConfigModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
