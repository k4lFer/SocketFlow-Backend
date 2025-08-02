import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth.token || client.handshake.headers.authorization;
      
      if (!token) {
        throw new WsException('Token not provided');
      }

      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      client.handshake.auth.userId = payload.sub;
      
      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }
} 