import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { CategoryEntity } from '../categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, CategoryEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
