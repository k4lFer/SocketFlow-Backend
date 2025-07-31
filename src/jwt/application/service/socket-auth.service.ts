import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/shared/common/interface/jwt-payload';

@Injectable()
export class SocketAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async verifySocketToken(token: string): Promise<{ userId: string; username: string } | null> {
    try {
      // El jwtService ya está configurado con el secreto a través de JwtModule.registerAsync
      // Es mejor usar la versión asíncrona para no bloquear el event loop.
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.accessToken.secret')
      });

      return {
        userId: payload.id,
        username: payload.username
      };
    } catch (err) {
      // El error de verifyAsync será un JsonWebTokenError o TokenExpiredError
      throw new UnauthorizedException('Invalid or expired token');
      return null;
    }
  }
}
