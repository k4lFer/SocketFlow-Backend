import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionRepository } from './infrastructure/adapter/user-session.repository';
import { UserSessionOrmMapper } from './infrastructure/mapper/user-session.orm.mapper';
import { CreateUserSessionService } from './application/service/create-user-session.service';
import { DeactivateUserSessionService } from './application/service/deactivate-user-session.service';
import { GetUserSessionService } from './application/service/get-user-session.service';
import { UserSessionService } from './domain/service/user-session.service';
import { UserSessionPublicOutMapper } from './application/mapper/user-session-public.out.mapper';
import { UserSessionOrm } from './infrastructure/orm/user-sessions.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSessionOrm])],
  providers: [
    // Application Services
    CreateUserSessionService,
    DeactivateUserSessionService,
    GetUserSessionService,

    // Domain Services
    UserSessionService, // <-- Esta es la línea clave que resuelve el error

    // Infrastructure
    UserSessionRepository,
    UserSessionOrmMapper,
    UserSessionPublicOutMapper,

    // Injections for Interfaces
    {
      provide: 'IUserSessionRepository',
      useExisting: UserSessionRepository,
    },
  ],
  exports: [
    CreateUserSessionService,
    DeactivateUserSessionService,
    GetUserSessionService,
  ],
})
export class UserSessionsModule {}