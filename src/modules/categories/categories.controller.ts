import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createReq: CreateCategoryDto) {
    await this.categoriesService.createCategory(createReq);
  }

  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/:id')
  async getCategory(@Param('id') id: string) {
    return await this.categoriesService.getCategory(id);
  }
}
