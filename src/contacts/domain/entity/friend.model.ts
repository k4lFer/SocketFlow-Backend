import { AggregateRoot } from "@nestjs/cqrs";
import { FriendshipCreatedEvent } from "../events/friendship-created.event";
import { FriendshipRemovedEvent } from "../events/friendship-removed.event";

export class Friendship extends AggregateRoot {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly friendId: string,
        public readonly createdAt: Date,
        public readonly user?: any,
    ) {
        super();
    }

    static create(userId: string, friendId: string): Friendship {

        const friendship = new Friendship(
            crypto.randomUUID(),
            userId,
            friendId,
            new Date()
        );

        friendship.apply(new FriendshipCreatedEvent(userId, friendId));

        return friendship;
    }

    remove(removerId: string): void {
        const otherUserId = this.userId === removerId ? this.friendId : this.userId;
        
        this.apply(new FriendshipRemovedEvent(removerId, otherUserId));
    }

    involvesUser(userId: string): boolean {
        return this.userId === userId || this.friendId === userId;
    }

    getOtherUser(userId: string): string {
        if (this.userId === userId) return this.friendId;
        if (this.friendId === userId) return this.userId;
        return '';
    }
}