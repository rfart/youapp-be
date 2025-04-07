import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
// @UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.chatService.create({
      senderId: req.user.userId,
      receiverId: createMessageDto.receiverId,
      content: createMessageDto.content,
    });
  }

  @Get('conversations/:userId')
  findConversation(@Request() req, @Param('userId') userId: string) {
    return this.chatService.findConversation(req.user.userId, userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.chatService.getUnreadCount(req.user.userId);
  }
}
