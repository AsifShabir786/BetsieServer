// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  private onlineUsers = new Map<number, string>(); // userId => socketId

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    this.onlineUsers.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: { senderId: number; receiverId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { senderId, receiverId, message } = payload;
    const savedMessage = await this.chatService.saveMessage(senderId, receiverId, message);

    const receiverSocketId = this.onlineUsers.get(receiverId);
    if (receiverSocketId) {
      client.to(receiverSocketId).emit('receiveMessage', savedMessage);
    }

    // Emit to sender as well
    client.emit('messageSent', savedMessage);
  }
}
