// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from '../comments/comments.service';
import { Comment } from './dto/message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private commentService: CommentsService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.join(data);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: string; comment: Comment },
  ): Promise<void> {
    const { roomId, comment } = data;

    this.server.to(roomId).emit('comment', comment);
    return this.commentService.createComment(
      comment.user_id,
      comment.message,
      roomId,
    );
  }
}
