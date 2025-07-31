import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FriendRequestAcceptedEvent } from "src/contacts/domain/events/friend-request-accepted.event";
import { UserGateway } from "src/user/infrastructure/gateway/user.gateway";

@EventsHandler(FriendRequestAcceptedEvent)
export class FriendRequestAcceptedEventHandler implements IEventHandler<FriendRequestAcceptedEvent> {
    constructor(
        private readonly userGateway: UserGateway
    ) {}

    async handle(event: FriendRequestAcceptedEvent): Promise<void> {
        await this.userGateway.sendFriendRequestNotification(event.senderId, {
            type: 'friend_request_accepted',
            requestId: event.friendRequestId,
            acceptedBy: event.receiverId,
            message: 'Your friend request has been accepted'
        });
    }
}