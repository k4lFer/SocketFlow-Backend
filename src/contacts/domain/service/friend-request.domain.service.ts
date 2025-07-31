import { Inject, Injectable } from "@nestjs/common";
import { IFriendRequestRepository } from "../port/friend-request.interface";
import { IFriendshipRepository } from "../port/friend.interface";
import { Friendship } from "../entity/friend.model";
import { Result } from "src/shared/response/result.impl";


@Injectable()
export class FriendRequestDomainService {
    async canSendFriendRequest(
        senderId: string,
        receiverId: string,
        @Inject('FriendRequestRepository')
        friendRequestRepository: IFriendRequestRepository,
        @Inject('FriendshipRepository')
        friendshipRepository: IFriendshipRepository
    ): Promise<Result<any>> {
        
        // Verificar si ya son amigos
        const existingFriendship = await friendshipRepository.findByUsers(senderId, receiverId);
        if (existingFriendship) {
            return Result.error(null, 'You are already friends' );
        }

        // Verificar si ya existe una solicitud pendiente
        const existingRequest = await friendRequestRepository.findPendingBetween(senderId, receiverId);
        if (existingRequest) {
            return Result.error(null, 'There is already a pending friend request' );
        }

        // Verificar solicitud inversa
        const inverseRequest = await friendRequestRepository.findPendingBetween(receiverId, senderId);
        if (inverseRequest) {
            return Result.error(null, 'The receiver has already sent you a friend request' );
        }

        return Result.ok(null, '');
    }

    createBidirectionalFriendship(userId: string, friendId: string): Friendship[] {
        return [
            Friendship.create(userId, friendId),
            Friendship.create(friendId, userId)
        ];
    }
}