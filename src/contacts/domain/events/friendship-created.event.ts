export class FriendshipCreatedEvent {
    constructor(
        public readonly userId: string,
        public readonly friendId: string,
        public readonly occurredOn: Date = new Date()
    ) {}
}
