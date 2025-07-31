import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { JwtModule as NestJwtModule, JwtService } from '@nestjs/jwt';
import { JwtServiceImpl } from './infrastructure/jwt-impl.service';
import { SocketAuthService } from './application/service/socket-auth.service';

@Module({
  imports: [
    ConfigModule,
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessToken.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessToken.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AccessTokenStrategy,
    SocketAuthService,
    {
      provide: 'IJwtService',
      useClass: JwtServiceImpl,
    },
  ],
  exports: ['IJwtService', SocketAuthService],
})
export class JwtModule {}
