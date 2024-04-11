import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
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

  async findPostBySlug(slug: string): Promise<PostEntity> {
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
}
