import { Command } from "@nestjs/cqrs";

export class RemoveFriendshipCommand extends Command<any> {
    constructor(
        public readonly userId: string,
        public readonly friendId: string
    ) {
        super();
    }

}