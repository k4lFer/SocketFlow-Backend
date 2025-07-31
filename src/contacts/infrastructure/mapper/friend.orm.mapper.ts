import { Injectable } from "@nestjs/common";

import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { FriendOrmEntity } from "../orm/friend.orm-entity";
import { Friendship } from "src/contacts/domain/entity/friend.model";

@Injectable()
export class FriendshipOrmMapper implements BaseDomainMapper<Friendship, FriendOrmEntity> {
    toDomain(ormEntity: FriendOrmEntity): Friendship {
        return new Friendship(
            ormEntity.id,
            ormEntity.userId,
            ormEntity.friendId,
            ormEntity.createdAt
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