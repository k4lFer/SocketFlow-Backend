export class FriendRequestAcceptedEvent {
    constructor(
        public readonly friendRequestId: string,
        public readonly senderId: string,
        public readonly receiverId: string,
        public readonly occurredOn: Date = new Date()
    ) {}
}