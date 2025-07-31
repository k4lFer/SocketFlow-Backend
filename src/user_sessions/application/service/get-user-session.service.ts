import { Inject, Injectable } from "@nestjs/common";
import { IUserSessionRepository } from "src/user_sessions/domain/port/user-session-repository.interface";
import { UserSessionPublicDto } from "../dto/out/user-session-public.dto";
import { UserSessionPublicOutMapper } from "../mapper/user-session-public.out.mapper";
import { IService } from "src/shared/common/interface/services.interface";
import { Result } from "src/shared/response/result.impl";

@Injectable()
export class GetUserSessionService implements IService<string> {
  constructor(
    @Inject('IUserSessionRepository')
    private readonly sessionRepo: IUserSessionRepository,
    private readonly mapper : UserSessionPublicOutMapper
  ) {}

  async execute(userId: string): Promise<Result<UserSessionPublicDto[]>> {
    try {
      const sessions = await this.sessionRepo.findByUserId(userId);
      const sessionsDto = this.mapper.toListResponse(sessions);
      return Result.ok(sessionsDto, 'Sessions retrieved successfully');
    } catch (error) {
      return Result.exception([], 'Failed to retrieve sessions', error.toString());
    }
  }
}
