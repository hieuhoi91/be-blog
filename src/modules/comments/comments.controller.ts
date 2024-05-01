import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:id')
  async getListCommentsById(@Param('id') id: string) {
    const comment = await this.commentsService.getCommentsByPostId(id);
    return comment;
  }
}
