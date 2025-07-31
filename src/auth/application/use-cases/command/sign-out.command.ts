import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";

export class SignOutCommand extends Command<Result<any>> {
    constructor(
        public readonly userId: string,
        public readonly socketId: string
  ) {
    super();
  }
}