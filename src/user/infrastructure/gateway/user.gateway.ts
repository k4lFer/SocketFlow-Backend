import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthService } from 'src/jwt/application/service/socket-auth.service';
import { CreateUserSessionService } from 'src/user_sessions/application/service/create-user-session.service';
import { DeactivateUserSessionService } from 'src/user_sessions/application/service/deactivate-user-session.service';
import { ConnectedUser } from './interfaces/connected-user.interface';
import { NotificationData } from './interfaces/notification-data.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  private connectedUsers = new Map<string, ConnectedUser>();
  private userSocketMap = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly socketAuthService: SocketAuthService,
    private readonly createSession: CreateUserSessionService,
    private readonly deactivateSession: DeactivateUserSessionService,
  ) {}
      async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
            
            if (!token) {
                client.disconnect();
                return;
            }

            const user = await this.socketAuthService.verifySocketToken(token);
            if (!user) {
                client.disconnect();
                return;
            }

            // Desconectar sesión anterior si existe
            const existingSocketId = this.userSocketMap.get(user.userId);
            if (existingSocketId) {
                const existingSocket = this.server.sockets.sockets.get(existingSocketId);
                if (existingSocket) {
                    existingSocket.disconnect();
                }
            }

            // Registrar nueva conexión
            const connectedUser: ConnectedUser = {
                userId: user.userId,
                username: user.username,
                socketId: client.id,
                connectedAt: new Date()
            };

            this.connectedUsers.set(client.id, connectedUser);
            this.userSocketMap.set(user.userId, client.id);

            // Unir al usuario a su sala personal
            client.join(`user_${user.userId}`);

            console.log(`Usuario ${user.username} (${user.userId}) conectado`);
        } catch (error) {
            console.error('Error en conexión WebSocket:', error);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            this.connectedUsers.delete(client.id);
            this.userSocketMap.delete(user.userId);

            console.log(`Usuario ${user.username} (${user.userId}) desconectado`);
        }
    }
 // Verificar si un usuario está online
    isUserOnline(userId: string): boolean {
        return this.userSocketMap.has(userId);
    }

    // Obtener usuarios conectados
    getOnlineUsers(): ConnectedUser[] {
        return Array.from(this.connectedUsers.values());
    }

    // Obtener socket de un usuario
    getUserSocket(userId: string): string | undefined {
        return this.userSocketMap.get(userId);
    }

    // Notificar estado online a amigos
    async notifyFriendsUserOnline(userId: string, friendIds: string[]): Promise<void> {
        const notification = {
            type: 'friend_status_changed',
            userId,
            status: 'online',
            timestamp: new Date()
        };

        friendIds.forEach(friendId => {
            this.server.to(`user_${friendId}`).emit('friend_status_changed', notification);
        });
    }

    // Notificar estado offline a amigos
    async notifyFriendsUserOffline(userId: string, friendIds: string[]): Promise<void> {
        const notification = {
            type: 'friend_status_changed',
            userId,
            status: 'offline',
            timestamp: new Date()
        };

        friendIds.forEach(friendId => {
            this.server.to(`user_${friendId}`).emit('friend_status_changed', notification);
        });
    }
  async sendFriendRequestNotification(receiverId: string, notification: NotificationData): Promise<void> {
    const socketId = this.getUserSocket(receiverId);

    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    } else {
      console.log(`Usuario ${receiverId} no está conectado. Notificación no entregada.`);
    }
  }
}
