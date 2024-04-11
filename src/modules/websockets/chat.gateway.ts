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
import { Messsage } from './dto/message.dto';

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
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    console.log(data);

    const { roomId, message } = data;
    this.server.to(roomId).emit('message', message);
    // const user = await this.authService.handleVerifyToken(
    //   socket.handshake.auth.token,
    // );
    // console.log(user.id);

    // let listComment = [];

    // const comment = new Messsage(user.id, roomId, message);
    // listComment.push(comment);
    // console.log(listComment);
    // return this.commentService.createComment(comment);
  }
}
