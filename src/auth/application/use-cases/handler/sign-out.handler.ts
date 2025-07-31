import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignOutCommand } from "../command/sign-out.command";
import { Result } from "src/shared/response/result.impl";
import { DeactivateUserSessionService } from "src/user_sessions/application/service/deactivate-user-session.service";

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(
    private readonly deactivateSession: DeactivateUserSessionService
  ) {}

  async execute(command: SignOutCommand): Promise<Result<any>> {
    const result = await this.deactivateSession.execute(command.socketId);
    return Result.ok(null, 'Session closed successfully');
  }
}