import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserGateway } from 'src/user/infrastructure/gateway/user.gateway';
import { FriendRequestSentEvent } from 'src/contacts/domain/events/friend-request-sent.event';

@EventsHandler(FriendRequestSentEvent)
export class FriendRequestSentEventHandler implements IEventHandler<FriendRequestSentEvent> {
  constructor(
    @Inject(UserGateway)
    private readonly userGateway: UserGateway
  ) {}

    async handle(event: FriendRequestSentEvent): Promise<void> {
        // Enviar notificación WebSocket
        await this.userGateway.sendFriendRequestNotification(event.receiverId, {
            type: 'friend_request_received',
            requestId: event.friendRequestId,
            senderId: event.senderId,
            message: 'You have received a new friend request'
        });
    }
}
