import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { SimpleResponse } from 'src/common/dto/page.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:id')
  async getListCommentsById(@Param('id') id: string) {
    const comment = await this.commentsService.getCommentsByPostId(id);
    return comment;
  }
}
