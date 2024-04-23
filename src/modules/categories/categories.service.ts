import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(createReq: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create({
        name: createReq.name,
        description: createReq?.description,
        slug: createReq.slug,
      });

      await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof QueryFailedError)
        throw new HttpException(
          'categories already exits',
          HttpStatus.CONFLICT,
        );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async getAllCategories() {
    return await this.categoryRepository.find({
      select: ['id', 'name', 'description', 'slug'],
    });
  }

  async getCategory(id: string) {
    return this.categoryRepository.findOneBy({ id: id });
  }
}
