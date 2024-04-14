// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { CommentsService } from '../comments/comments.service';
import { Comment } from './dto/message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private commentService: CommentsService,
  ) {}

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
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const { roomId, comment } = data;
    console.log(roomId, comment);

    this.server.to(roomId).emit('comment', comment);
    return this.commentService.createComment(
      comment.user_id,
      comment.message,
      roomId,
    );
  }
}
