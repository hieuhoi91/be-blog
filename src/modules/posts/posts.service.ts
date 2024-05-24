import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PageOptionsDto } from '../../dtos/page.option.dto';
import { PageMetaDto } from '../../dtos/page.meta.dto';
import { PageDto } from '../../dtos/page.dto';
import { RecommendationService } from '../recommender/recommender.service';
import * as Redis from 'ioredis';
import { RedisService } from '../redis/redis.service';
import { Gorse } from 'gorsejs';
import { CategoriesService } from '../categories/categories.service';
import { faker } from '@faker-js/faker';
import { CategoryEntity } from '../categories/category.entity';
import { read } from 'fs';

@Injectable()
export class PostsService {
  private gorseClient: Gorse<string>;
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private recommendationService: RecommendationService,
    private cateService: CategoriesService,
    private redisService: RedisService,
  ) {
    this.gorseClient = new Gorse({
      endpoint: 'http://192.168.1.244:8088',
      secret: '',
    });
  }

  async createPost(userId: string, reqCreate: CreatePostDto): Promise<void> {
    try {
      const post = this.postRepository.create({
        title: reqCreate.title,
        thumbnail: reqCreate.thumbnail_url,
        description: reqCreate.description,
        category_id: reqCreate.category_id,
        user_id: userId,
      });
      await this.postRepository.save(post);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async createFakePost(userId: string): Promise<void> {
    const cate = await this.cateService.getAllCategories();

    try {
      for (let i = 1; i < 100; i++) {
        const randomCate = (arr: CategoryEntity[]) => {
          const index = Math.floor(Math.random() * arr.length);
          return arr[index].id;
        };
        const post = this.postRepository.create({
          title: faker.lorem.sentences({ min: 1, max: 3 }),
          thumbnail: faker.image.urlPicsumPhotos({ width: 250, height: 250 }),
          description: faker.lorem.paragraphs(5),
          category_id: randomCate(cate),
          user_id: userId,
        });
        await this.postRepository.save(post);
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updatePost(post_id: string, attr: Partial<CreatePostDto>) {
    const post = await this.postRepository.findOneBy({ id: post_id });

    if (!post) {
      throw new NotFoundException('post not found');
    }

    Object.assign(post, attr);
    return await this.postRepository.save(post);
  }

  async getAllPosts(pageOptionsDto: PageOptionsDto) {
    try {
      const queryBuilder = this.postRepository.createQueryBuilder('posts');
      queryBuilder
        .leftJoinAndSelect('posts.user', 'user')
        .select(['posts', 'user.id', 'user.username', 'user.avatar'])
        .orderBy('posts.createdAt', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      this.recommendationService.train(entities);

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findPostBySlug(slug: string, user_id?: string): Promise<PostEntity> {
    try {
      const posts = await this.postRepository.findOne({
        where: { slug: slug },
        relations: ['user'],
        select: {
          user: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      });

      console.log(user_id);
      console.log(posts);

      user_id &&
        this.gorseClient.insertFeedbacks([
          {
            FeedbackType: 'like',
            UserId: user_id,
            ItemId: posts.id,
            Timestamp: new Date(),
          },
          {
            FeedbackType: 'read',
            UserId: user_id,
            ItemId: posts.id,
            Timestamp: new Date(),
          },
        ]);
      // await this.redisService.pushToList(user_id, JSON.stringify(posts));

      return posts;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findPostsByUserId(userId: string): Promise<PostEntity[]> {
    try {
      // join user by user_id
      const posts = await this.postRepository.find({
        where: { user_id: userId },
        relations: ['user'],
      });
      return posts;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findPostsByCategoryId(categoryId: string): Promise<PostEntity[]> {
    try {
      const posts = await this.postRepository.find({
        where: { category_id: categoryId },
        relations: ['user'],
        select: {
          user: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      });
      return posts;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async deletePost(postId: string) {
    return await this.postRepository.delete(postId);
  }

  async searchByName(query: string, user_id?: string): Promise<PostEntity[]> {
    user_id &&
      (await this.redisService.pushToList(user_id, JSON.stringify(query)));

    const dataSearchResult = await this.postRepository
      .createQueryBuilder('posts')
      .where('LOWER(posts.title) ILIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      // .orWhere('LOWER(post.description) ILIKE :title', {
      //   title: `%${query.toLowerCase()}%`,
      // })
      .getMany();

    return dataSearchResult;
  }

  async trainData() {
    const posts = await this.postRepository.find({
      relations: ['categories'],
    });
    posts.forEach((post) => {
      this.gorseClient.upsertItem({
        ItemId: post.id,
        IsHidden: false,
        Timestamp: post.createdAt,
        Categories: [post.categories.name],
        Comment: post.title,
        Labels: [post.categories.name],
      });
    });
    // this.recommendationService.train(posts);

    return posts;
  }

  async recommended(user_id: string) {
    // const searchHistory = await this.redisService.getList(user_id);
    // return this.recommendationService.classify(searchHistory);
    // return this.gorseClient.getRecommend();
  }
}
