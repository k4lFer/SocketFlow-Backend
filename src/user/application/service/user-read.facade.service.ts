import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/user/domain/port/user-repository.interface';
import { UserPublicDto } from '../dto/out/user-public.dto';
import { UserPublicOutMapper } from '../mapper/user-public.out.mapper';

@Injectable()
export class UserReadFacade {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly mapper: UserPublicOutMapper
  ) {}

  async getById(id: string): Promise<UserPublicDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.mapper.toResponse(user) : null;
  }

}
