export class FriendshipRemovedEvent {
    constructor(
        public readonly removerId: string,
        public readonly removedId: string,
        public readonly occurredOn: Date = new Date()
    ) {}
}