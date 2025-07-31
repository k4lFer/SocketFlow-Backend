import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserPatchCommand } from "../command/user-patch.command";
import { Result } from "src/shared/response/result.impl";
import { IUserRepository } from "src/user/domain/port/user-repository.interface";
import { Inject } from "@nestjs/common";
import { User } from "src/user/domain/entity/user.model";

@CommandHandler(UserPatchCommand)
export class UserPatchHandler implements ICommandHandler<UserPatchCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly repository: IUserRepository
  ) {}

  async execute(command: UserPatchCommand): Promise<Result<any>> {
    const { id, data } = command;

    const user = await this.repository.findById(id);
    if (!user) {
      return Result.error(null, 'User not found');
    }

    const updated = User.patch(user, data);
    const saved = await this.repository.save(updated);

    return Result.ok(saved, 'User updated');
  }
}
