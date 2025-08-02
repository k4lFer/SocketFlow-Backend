import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";

export class CancelFriendRequestCommand extends Command<Result<any>> {
    constructor(
        private readonly userId:string,
        private readonly requestId:string
    ) {
        super();
    }
}