import { Module } from '@nestjs/common';
import { RecommendationService } from './recommender.service';
import { RecommendationController } from './recommender.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommenderModule {}
