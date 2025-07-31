// src/user_sessions/application/service/deactivate-user-session.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { Result } from "src/shared/response/result.impl";
import { IUserSessionRepository } from "src/user_sessions/domain/port/user-session-repository.interface";
import { UserSessionService } from "src/user_sessions/domain/service/user-session.service";
import { IService } from "src/shared/common/interface/services.interface";

@Injectable()
export class DeactivateUserSessionService implements IService<string> {
  constructor(
    @Inject('IUserSessionRepository')
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly domainService: UserSessionService
  ) {}

  async execute(socketId: string): Promise<Result<any>> {
    try {
      const session = await this.userSessionRepository.findBySocketId(socketId);
      if (!session) {
        return Result.error(null, 'Session not found for the given socketId.');
      }

      this.domainService.disconnect(session);
      await this.userSessionRepository.save(session);
      return Result.ok(null, 'Session deactivated successfully');
    } catch (error) {
      return Result.exception(null, 'Failed to deactivate session', error.toString());
    }
  }
}
