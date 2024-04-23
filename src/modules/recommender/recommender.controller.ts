import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  recommend(@Req() req) {
    return this.recommenderService.recommend(req.user.id);
  }
}
