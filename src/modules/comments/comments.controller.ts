import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:id')
  getListCommentsById(@Param() id: string) {
    return this.commentsService.getCommentsbyPostId(id);
  }
}
