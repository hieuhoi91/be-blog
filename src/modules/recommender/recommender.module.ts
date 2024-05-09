import { Module } from '@nestjs/common';
import { RecommendationService } from './recommender.service';
import { RecommendationController } from './recommender.controller';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommenderModule {}
