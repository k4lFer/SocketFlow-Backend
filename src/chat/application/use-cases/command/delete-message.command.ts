import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";

export class DeleteMessageCommand extends Command<Result<any>> {
  constructor(
    public readonly messageId: string,
    public readonly userId: string,
    public readonly chatId: string
  ) {
    super();
  }
} 