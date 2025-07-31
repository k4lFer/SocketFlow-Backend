// user/domain/services/user-login.service.ts
import { Result } from 'src/shared/response/result.impl';
import { User } from '../entity/user.model';
import { IPasswordHasher } from '../port/password-hasher.interface';
import { Inject } from '@nestjs/common';

export class UserLoginService {
  
  constructor(
    @Inject('IPasswordHasher')
    private readonly hasher: IPasswordHasher
  ) {}
  
  async validateCredentials(user: User, plainPassword: string): Promise<Result<any>> {
    const isMatch = await this.hasher.compare(plainPassword, user.password);
    if (!isMatch) return Result.error(null, 'Invalid credentials check your password or email and try again.');

    return Result.ok({ user_id: user.id, username: user.username }, 'Login successful');
  }
}
