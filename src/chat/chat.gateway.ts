import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Remove user from the map when disconnected
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        break;
      }
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    this.userSocketMap.set(userId, client.id);
    return { status: 'ok' };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto & { senderId: string },
  ) {
    const message = await this.chatService.create({
      senderId: createMessageDto.senderId,
      receiverId: createMessageDto.receiverId,
      content: createMessageDto.content,
    });

    // If receiver is online, send the message to them
    const receiverSocketId = this.userSocketMap.get(createMessageDto.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', message);
    }

    return message;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    return this.chatService.markAsRead(data.messageId);
  }
}
