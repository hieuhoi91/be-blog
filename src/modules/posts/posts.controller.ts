import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('posts')
export class PostsController {
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPost(@Req() req: Request, @Body() createPost: CreatePostDto) {
    console.log(req['user']);
    console.log(1, createPost);
  }
}
