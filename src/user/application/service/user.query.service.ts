import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/user/domain/port/user-repository.interface';
import { User } from 'src/user/domain/entity/user.model';

@Injectable()
export class UserQueryService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

}
