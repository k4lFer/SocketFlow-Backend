import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { SignInValidator } from './application/validator/sign-in.validator';
import { SignUpValidator } from './application/validator/sign-up.validator';
import { AuthService } from './application/service/auth.service';
import { SignUpCommandHandler } from './application/use-cases/handler/sign-up.handler';
import { SignInCommandHandler } from './application/use-cases/handler/sign-in.handler';
import { AuthController } from './presentation/auth.command.controller';

@Module({
  imports: [
    UserModule, // Provides UserAuthService and IService<UserCreateInput>
    JwtModule,  // Provides "IJwtService"
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    SignUpCommandHandler,
    SignInCommandHandler,
    {
      provide: 'SignInValidator',
      useClass: SignInValidator,
    },
    {
      provide: 'SignUpValidator',
      useClass: SignUpValidator,
    },
  ],
})
export class AuthModule {}