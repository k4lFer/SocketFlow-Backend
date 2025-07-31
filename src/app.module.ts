import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { ChatModule } from './chat/chat.module';
import { ContactsModule } from './contacts/contacts.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared/common/config/configuration';
import { DatabaseModule } from './shared/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSessionsModule } from './user_sessions/user_sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    CqrsModule.forRoot(),
    UserModule, 
    AuthModule, 
    JwtModule, 
    ChatModule, 
    ContactsModule, UserSessionsModule,
  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule {}
