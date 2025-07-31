import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm/user.orm-entity';
import { UserRepository } from './infrastructure/adapter/user.repository';
import { UserOrmMapper } from './infrastructure/mapper/user.orm.mapper';
import { UserCreateService } from './application/service/create.service';
import { BcryptHasher } from './infrastructure/adapter/bcrypt.hasher';
import { UserAuthService } from './application/service/user.auth.service';
import { UserQueryService } from './application/service/user.query.service';
import { UserReadFacade } from './application/service/user-read.facade.service';
import { UserLoginService } from './domain/service/user-login.service';
import { UserPublicOutMapper } from './application/mapper/user-public.out.mapper';
import { UserOutMapper } from './application/mapper/user.out.mapper';
import { UserPatchHandler } from './application/use-cases/handler/user-patch.handler';
import { JwtModule } from '../jwt/jwt.module';
import { UserSessionsModule } from 'src/user_sessions/user_sessions.module';
import { UserGateway } from './infrastructure/gateway/user.gateway';
import { UserCommandController } from './presentation/user.command.controller';
import { UserQueryController } from './presentation/user.query.controller';

    @Module({
        imports: [
            TypeOrmModule.forFeature([UserOrmEntity]),
            JwtModule,
            UserSessionsModule,
        ],

        controllers: [
            UserCommandController,
            UserQueryController
        ],

        providers: [
            // Servicios de aplicación
            UserCreateService,
            UserAuthService,
            UserQueryService,
            UserReadFacade,

            UserGateway,

            // Handlers 
            UserPatchHandler,

            // Servicios de dominio
            UserLoginService,

            // Infraestructura
            UserRepository,
            UserOrmMapper,
            UserPublicOutMapper,
            UserOutMapper,
            BcryptHasher,

            // Inyecciones
            { provide: 'IUserRepository', useExisting: UserRepository },
            { provide: 'IPasswordHasher', useExisting: BcryptHasher },
            { provide: 'IService<UserCreateInput>', useExisting: UserCreateService }
        ],

        exports: [UserReadFacade, UserAuthService, 'IService<UserCreateInput>', UserGateway]
    })
    export class UserModule {}
