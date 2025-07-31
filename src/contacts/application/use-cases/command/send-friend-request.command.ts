import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { SendRequestDto } from "../../dto/in/send-request.dto";

export class SendFriendRequestCommand extends Command<Result<any>>{
  constructor(
    public readonly data: { senderId: string; receiverId: string }
  ) {
    super();
  }
}
