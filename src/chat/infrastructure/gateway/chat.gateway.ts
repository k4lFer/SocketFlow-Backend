import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UserActive } from 'src/shared/common/decorators/user-active.decorator';
import { WsJwtGuard } from 'src/shared/common/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.set(userId, client);
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join-chat')
  @UseGuards(WsJwtGuard)
  async handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
    @UserActive() userId: string
  ) {
    client.join(data.chatId);
    console.log(`User ${userId} joined chat ${data.chatId}`);
    
    return { event: 'joined-chat', chatId: data.chatId };
  }

  @SubscribeMessage('leave-chat')
  @UseGuards(WsJwtGuard)
  async handleLeaveChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
    @UserActive() userId: string
  ) {
    client.leave(data.chatId);
    console.log(`User ${userId} left chat ${data.chatId}`);
    
    return { event: 'left-chat', chatId: data.chatId };
  }

  @SubscribeMessage('typing')
  @UseGuards(WsJwtGuard)
  async handleTyping(
    @MessageBody() data: { chatId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
    @UserActive() userId: string
  ) {
    // Emitir evento de typing a todos los miembros del chat excepto al remitente
    client.to(data.chatId).emit('user-typing', {
      userId,
      chatId: data.chatId,
      isTyping: data.isTyping
    });
  }

  @SubscribeMessage('stop-typing')
  @UseGuards(WsJwtGuard)
  async handleStopTyping(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
    @UserActive() userId: string
  ) {
    client.to(data.chatId).emit('user-stopped-typing', {
      userId,
      chatId: data.chatId
    });
  }

  // Métodos para emitir eventos desde el servidor
  emitMessageSent(chatId: string, message: any) {
    this.server.to(chatId).emit('message-sent', message);
  }

  emitMessageDelivered(chatId: string, messageId: string, userId: string) {
    this.server.to(chatId).emit('message-delivered', {
      messageId,
      userId,
      timestamp: new Date()
    });
  }

  emitMessageSeen(chatId: string, messageId: string, userId: string) {
    this.server.to(chatId).emit('message-seen', {
      messageId,
      userId,
      timestamp: new Date()
    });
  }

  emitMessageDeleted(chatId: string, messageId: string, userId: string) {
    this.server.to(chatId).emit('message-deleted', {
      messageId,
      userId,
      timestamp: new Date()
    });
  }

  emitUserOnline(userId: string) {
    this.server.emit('user-online', { userId, timestamp: new Date() });
  }

  emitUserOffline(userId: string) {
    this.server.emit('user-offline', { userId, timestamp: new Date() });
  }

  // Método para obtener usuarios conectados
  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Método para verificar si un usuario está conectado
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Método para enviar mensaje privado a un usuario
  sendPrivateMessage(userId: string, event: string, data: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit(event, data);
    }
  }
}
