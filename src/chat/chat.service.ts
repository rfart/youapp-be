import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageData: {
    senderId: string;
    receiverId: string;
    content: string;
  }): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageData);
    return createdMessage.save();
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  async markAsRead(messageId: string): Promise<Message> {
    const message = await this.messageModel
      .findByIdAndUpdate(messageId, { isRead: true }, { new: true })
      .exec();
    
    if (!message) {
      throw new NotFoundException(`Message with id ${messageId} not found`);
    }
    
    return message;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiverId: userId,
      isRead: false,
    });
  }
}
