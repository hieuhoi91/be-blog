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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
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

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findPostBySlug(slug: string, user_id: string): Promise<PostEntity> {
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

      // if (user_id) {
      //   const data = [];
      //   await this.cacheService.del(user_id);
      //   for (let i = 0; i < data.length; i++) {}
      // }

      user_id &&
        (await this.cacheService.store.set(slug.toString(), posts, 86400));

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

  async searchByName(query: string): Promise<PostEntity[]> {
    // const cachedData = await this.cacheService.get('con');

    const dataSearchResult = await this.postRepository
      .createQueryBuilder('post')
      .where('LOWER(post.title) ILIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      // .orWhere('LOWER(post.description) ILIKE :title', {
      //   title: `%${query.toLowerCase()}%`,
      // })
      .getMany();

    console.log(dataSearchResult);

    return dataSearchResult;
  }
}
