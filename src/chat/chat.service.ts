// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
  ) {}

  async saveMessage(senderId: number, receiverId: number, message: string): Promise<ChatMessage> {
    const newMessage = this.chatRepo.create({ senderId, receiverId, message });
    return this.chatRepo.save(newMessage);
  }

  async getMessagesBetweenUsers(user1: number, user2: number): Promise<ChatMessage[]> {
    return this.chatRepo.find({
      where: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
      order: { timestamp: 'ASC' },
    });
  }
}
