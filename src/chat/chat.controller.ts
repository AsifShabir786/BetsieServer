// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

// @Controller('chat')
// export class ChatController {
//   constructor(private readonly chatGateway: ChatGateway) {}

//   @Post('send')
//   sendMessage(@Body() payload: { senderId: number; receiverId: number; message: string }) {
//     this.chatGateway.sendMessageToClients(payload);
//     return { status: 'sent' };
//   }
// }
