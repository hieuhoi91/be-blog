import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { Messsage } from '../websockets/dto/message.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(comment: Messsage): Promise<void> {
    const data = this.commentRepository.create({
      comment: comment.message,
      user_id: comment.user_id,
      post_id: comment.post_id,
    });

    this.commentRepository.save(data);
  }

  async getCommentsbyPostId(postId: string): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: { post_id: postId },
      take: 10,
      order: {
        createdAt: 'ASC', // "DESC"
      },
    });
  }
}
