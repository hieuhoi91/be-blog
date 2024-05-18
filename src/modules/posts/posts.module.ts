import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { CategoryEntity } from '../categories/category.entity';
import { RedisModule } from '../redis/redis.module';
import { RecommenderModule } from '../recommender/recommender.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CategoryEntity]),
    RedisModule,
    RecommenderModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
