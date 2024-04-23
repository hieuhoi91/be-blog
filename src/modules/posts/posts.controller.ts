import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { PostsService } from './posts.service';
import { SimpleResponse } from 'src/common/dto/page.dto';
import { PostEntity } from './post.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createPost(@Req() req, @Body() createPost: CreatePostDto) {
    const post = await this.postsService.createPost(req.user.id, createPost);
    return new SimpleResponse(post, 'Success post created');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updatePost(@Param('id') idPost: string, @Body() attr: CreatePostDto) {
    await this.postsService.updatePost(idPost, attr);
    return new HttpException('Update post successfully', HttpStatus.OK);
  }

  @Get('/:slug')
  async getPostBySlug(@Param('slug') slug: string, @Req() req) {
    return await this.postsService.findPostBySlug(slug, req.user.id);
  }

  @Get('/findbyuser/:id')
  async getAllPostsByUser(@Param('id') userId: string) {
    return await this.postsService.findPostsByUserId(userId);
  }

  @Get('/findbycategory/:id')
  async getAllPostsByCategory(@Param('id') categoryId: string) {
    return await this.postsService.findPostsByCategoryId(categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deletePost(@Param('id') idPost: string) {
    await this.postsService.deletePost(idPost);
    return new HttpException('Delete post successfully', HttpStatus.OK);
  }

  @Get()
  async searchPost(@Query('title') title: string): Promise<PostEntity[]> {
    return await this.postsService.searchByName(title);
  }
}
