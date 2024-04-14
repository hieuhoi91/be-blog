import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    user_id: string,
    message: string,
    post_id: string,
  ): Promise<void> {
    const data = this.commentRepository.create({
      comment: message,
      user_id: user_id,
      post_id: post_id,
    });

    this.commentRepository.save(data);
  }

  async getCommentsByPostId(postId: string): Promise<CommentEntity[]> {
    // Fetch comments with user information
    const comments = await this.commentRepository.find({
      where: { post_id: postId },
      relations: ['user'], // Eagerly load user data
      select: {
        user: {
          // Add other desired user fields here (if applicable)
          id: true,
          username: true,
          avatar: true,
        },
      },
    });

    return comments;
  }
}
