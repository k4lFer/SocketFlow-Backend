import { Inject, Injectable } from "@nestjs/common";
import { IUserSessionRepository } from "src/user_sessions/domain/port/user-session-repository.interface";
import { UserSessionService } from "src/user_sessions/domain/service/user-session.service";
import { Result } from "src/shared/response/result.impl";
import { CreateUserSessionDto } from "../dto/in/create-user-session.dto";

@Injectable()
export class CreateUserSessionService {
  constructor(
    @Inject('IUserSessionRepository')
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly domainService: UserSessionService
  ) {}

  async execute(input: CreateUserSessionDto): Promise<Result<any>> {
    if (!input.userId || !input.socketId) {
      return Result.error(null, 'userId y socketId son obligatorios');
    }

    const ip = input.ipAddress ?? '';

    const session = this.domainService.createSession(
      input.userId,
      input.socketId,
      ip
    );

    const saved = await this.userSessionRepository.save(session);
    if (!saved) {
      return Result.error(null, 'No se pudo crear la sesión');
    }

    return Result.ok(null, 'Sesión creada correctamente');
  }
}
