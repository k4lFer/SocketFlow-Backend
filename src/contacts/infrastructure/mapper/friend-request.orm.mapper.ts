import { Injectable } from "@nestjs/common";
import { FriendRequest } from "src/contacts/domain/entity/friend-request.model";
import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { FriendRequestOrmEntity } from "../orm/friend-request.orm-entity";
import { FriendRequestStatus } from "src/contacts/domain/enum/friend-request.status.enum";

@Injectable()
export class FriendRequestOrmMapper implements BaseDomainMapper<FriendRequest, FriendRequestOrmEntity> {
    toDomain(ormEntity: FriendRequestOrmEntity): FriendRequest {
        const sender = ormEntity.sender;
        const receiver = ormEntity.receiver;
      
        const senderUser = sender
          ? {
              id: sender.id,
              username: sender.username,
              fullName: `${sender.firstName || ''} ${sender.lastName || ''}`.trim()
            }
          : undefined;
      
        const receiverUser = receiver
          ? {
              id: receiver.id,
              username: receiver.username,
              fullName: `${receiver.firstName || ''} ${receiver.lastName || ''}`.trim()
            }
          : undefined;
      
        return new FriendRequest(
          ormEntity.id,
          ormEntity.senderId,
          ormEntity.receiverId,
          ormEntity.status as FriendRequestStatus,
          ormEntity.createdAt,
          ormEntity.updatedAt,
          senderUser,
          receiverUser
        );
      }
      
    toPersistence(domain: FriendRequest): FriendRequestOrmEntity {
        const ormEntity = new FriendRequestOrmEntity();
        ormEntity.id = domain.id;
        ormEntity.senderId = domain.senderId;
        ormEntity.receiverId = domain.receiverId;
        ormEntity.status = domain.status;
        ormEntity.createdAt = domain.createdAt;
        ormEntity.updatedAt = domain.updatedAt;
        return ormEntity;
    }
}