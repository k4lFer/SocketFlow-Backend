import { Injectable } from "@nestjs/common";

import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { FriendOrmEntity } from "../orm/friend.orm-entity";
import { Friendship } from "src/contacts/domain/entity/friend.model";

@Injectable()
export class FriendshipOrmMapper implements BaseDomainMapper<Friendship, FriendOrmEntity> {
    toDomain(ormEntity: FriendOrmEntity): Friendship {
        const friend = ormEntity.friend;
    
        let fullName = '';
        let username = '';
        let bio = '';
    
        if (friend) {
            fullName = `${friend.firstName || ''} ${friend.lastName || ''}`.trim();
            username = friend.username || '';
            bio = friend.bio || '';
        }
    
        return new Friendship(
            ormEntity.id,
            ormEntity.userId,
            ormEntity.friendId,
            ormEntity.createdAt,
            friend
                ? {
                    id: friend.id,
                    username,
                    fullName,
                    bio
                }
                : undefined
        );
    }
    
    toPersistence(domain: Friendship): FriendOrmEntity {
        const ormEntity = new FriendOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.userId = domain.userId;
        ormEntity.friendId = domain.friendId;
        ormEntity.createdAt = domain.createdAt;
        return ormEntity;
    }

}