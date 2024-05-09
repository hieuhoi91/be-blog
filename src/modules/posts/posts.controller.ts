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
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { PostsService } from './posts.service';
import { SimpleResponse } from 'src/common/dto/page.dto';
import { PostEntity } from './post.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PageOptionsDto } from '../../dtos/page.option.dto';
import { PageDto } from '../../dtos/page.dto';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private configService: ConfigService,
  ) {}

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

  @Get()
  async getAllPosts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    return await this.postsService.getAllPosts(pageOptionsDto);
  }

  @Get('/:slug')
  async getPostBySlug(@Param('slug') slug: string, @Req() req) {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return await this.postsService.findPostBySlug(slug);
    }

    const token = authorizationHeader.split(' ')[1];
    try {
      const decodedToken: any = verify(
        token,
        this.configService.get<string>('SECRET_KEY'),
      );

      const { id } = decodedToken;
      // Lấy thông tin người dùng từ decodedToken và sử dụng trong ứng dụng của bạn
      return await this.postsService.findPostBySlug(slug, id);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
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

  @Get('/search')
  async searchPost(
    @Query('title') title: string,
    @Req() req,
  ): Promise<PostEntity[]> {
    console.log(title);

    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      console.log(title);

      return await this.postsService.searchByName(title, req);
    }

    const token = authorizationHeader.split(' ')[1];
    try {
      const decodedToken: any = verify(
        token,
        this.configService.get<string>('SECRET_KEY'),
      );

      const { id } = decodedToken;
      // Lấy thông tin người dùng từ decodedToken và sử dụng trong ứng dụng của bạn
      return await this.postsService.searchByName(title, id);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
