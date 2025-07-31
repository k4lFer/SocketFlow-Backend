import { AggregateRoot } from "@nestjs/cqrs";
import { FriendRequestStatus } from "../enum/friend-request.status.enum";
import { FriendRequestSentEvent } from "../events/friend-request-sent.event";
import { FriendRequestAcceptedEvent } from "../events/friend-request-accepted.event";
import { FriendRequestRejectedEvent } from "../events/friend-request-rejected.event";

export class FriendRequest extends AggregateRoot {
    constructor(
        public readonly id: string,
        public readonly senderId: string,
        public readonly receiverId: string,
        public status: FriendRequestStatus,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {
        super();
    }

    static create(senderId: string, receiverId: string): FriendRequest {
        // Regla de negocio básica
        if (senderId === receiverId) {
            throw new Error('Cannot send friend request to yourself');
        }

        const friendRequest = new FriendRequest(
            crypto.randomUUID(), 
            senderId,
            receiverId,
            FriendRequestStatus.PENDING,
            new Date(),
            new Date()
        );

        // Emitir evento de dominio
        friendRequest.apply(new FriendRequestSentEvent(
            friendRequest.id,
            senderId,
            receiverId
        ));

        return friendRequest;
    }

    accept(): void {
        if (this.status !== FriendRequestStatus.PENDING) {
            throw new Error('Can only accept pending friend requests');
        }

        this.status = FriendRequestStatus.ACCEPTED;
        this.updatedAt = new Date();

        this.apply(new FriendRequestAcceptedEvent(
            this.id,
            this.senderId,
            this.receiverId
        ));
    }

    reject(): void {
        if (this.status !== FriendRequestStatus.PENDING) {
            throw new Error('Can only reject pending friend requests');
        }

        this.status = FriendRequestStatus.REJECTED;
        this.updatedAt = new Date();

        this.apply(new FriendRequestRejectedEvent(
            this.id,
            this.senderId,
            this.receiverId
        ));
    }

    // Métodos de consulta
    isPending(): boolean {
        return this.status === FriendRequestStatus.PENDING;
    }

    isAccepted(): boolean {
        return this.status === FriendRequestStatus.ACCEPTED;
    }

    isRejected(): boolean {
        return this.status === FriendRequestStatus.REJECTED;
    }

    canBeRespondedBy(userId: string): boolean {
        return this.receiverId === userId && this.isPending();
    }

    isExpired(days: number = 30): boolean {
        const expirationDate = new Date(this.createdAt);
        expirationDate.setDate(expirationDate.getDate() + days);
        return new Date() > expirationDate && this.isPending();
    }
}