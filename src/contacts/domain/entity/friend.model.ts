import { AggregateRoot } from "@nestjs/cqrs";
import { FriendshipCreatedEvent } from "../events/friendship-created.event";
import { FriendshipRemovedEvent } from "../events/friendship-removed.event";

export class Friendship extends AggregateRoot {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly friendId: string,
        public readonly createdAt: Date
    ) {
        super();
    }

    static create(userId: string, friendId: string): Friendship {
        // Regla de negocio básica
        if (userId === friendId) {
            throw new Error('Cannot create friendship with yourself');
        }

        const friendship = new Friendship(
            crypto.randomUUID(), // Se generará en el repositorio
            userId,
            friendId,
            new Date()
        );

        friendship.apply(new FriendshipCreatedEvent(userId, friendId));

        return friendship;
    }

    remove(removerId: string): void {
        if (this.userId !== removerId && this.friendId !== removerId) {
            throw new Error('Only users involved in the friendship can remove it');
        }

        const otherUserId = this.userId === removerId ? this.friendId : this.userId;
        
        this.apply(new FriendshipRemovedEvent(removerId, otherUserId));
    }

    involvesUser(userId: string): boolean {
        return this.userId === userId || this.friendId === userId;
    }

    getOtherUser(userId: string): string {
        if (this.userId === userId) return this.friendId;
        if (this.friendId === userId) return this.userId;
        throw new Error('User is not part of this friendship');
    }
}