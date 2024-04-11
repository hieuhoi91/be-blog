import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() createReq: CreateCategoryDto) {
    await this.categoriesService.createCategory(createReq);
  }

  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getCategory(@Param('id') id: string) {
    return await this.categoriesService.getCategory(id);
  }
}
