import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";

export class AcceptFriendRequestCommand extends Command<Result<any>> {
    constructor(
        public readonly userId: string,
        public readonly requestId: string
    ) {
        super();
    }
}