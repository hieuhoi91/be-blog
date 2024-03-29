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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { PostsService } from './posts.service';
import { SimpleResponse } from 'src/common/dto/page.dto';

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

  @Get('/:id')
  async getAllPosts(@Param('id') userId: string) {
    return await this.postsService.findPostsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deletePost(@Param('id') idPost: string) {
    await this.postsService.deletePost(idPost);
    return new HttpException('Delete post successfully', HttpStatus.OK);
  }
}
