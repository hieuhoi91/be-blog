import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RecommendationService } from './recommender.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async suggestBasedOnSearchHistory(@Req() req) {
    const suggestedData =
      this.recommendationService.suggestBasedOnSearchHistory(req.user.id);
    return suggestedData;
  }
}
