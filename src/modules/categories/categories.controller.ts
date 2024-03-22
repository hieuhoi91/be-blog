import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createReq: CreateCategoryDto) {
    await this.categoriesService.createCategory(createReq);
  }
}
