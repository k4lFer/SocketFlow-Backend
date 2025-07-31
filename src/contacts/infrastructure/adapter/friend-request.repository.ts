import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "src/contacts/domain/entity/friend-request.model";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { Repository } from "typeorm";
import { FriendRequestOrmEntity } from "../orm/friend-request.orm-entity";
import { FriendRequestOrmMapper } from "../mapper/friend-request.orm.mapper";
import { FriendRequestStatus } from "src/contacts/domain/enum/friend-request.status.enum";
import { PagedResult } from "src/shared/domain/paged.result";

@Injectable()
export class FriendRequestRepository implements IFriendRequestRepository {
    constructor(
        @InjectRepository(FriendRequestOrmEntity)
        private readonly repository: Repository<FriendRequestOrmEntity>,
        private readonly mapper: FriendRequestOrmMapper
    ) {}
    async findReceivedRequestsPaged(userId: string, pageNumber: number, pageSize: number): Promise<PagedResult<FriendRequest>> {
         const offset = (pageNumber - 1) * pageSize;

        const [entities, total] = await this.repository.findAndCount({
        where: {
            receiverId: userId,
            status: FriendRequestStatus.PENDING
        },
        relations: ['sender'], // Asegúrate de definir correctamente en tu entity ORM
        order: { createdAt: 'DESC' },
        skip: offset,
        take: pageSize
        });

        const domainItems = entities.map(entity => this.mapper.toDomain(entity));
        return new PagedResult<FriendRequest>(domainItems, total, pageNumber, pageSize);
    }
    async findSentRequestsPaged(userId: string, pageNumber: number, pageSize: number): Promise<PagedResult<FriendRequest>> {
        const offset = (pageNumber - 1) * pageSize;

        const [entities, total] = await this.repository.findAndCount({
        where: {
            senderId: userId,
            status: FriendRequestStatus.PENDING
        },
        relations: ['receiver'], // Asegúrate de definir correctamente en tu entity ORM
        order: { createdAt: 'DESC' },
        skip: offset,
        take: pageSize
        });

        const domainItems = entities.map(entity => this.mapper.toDomain(entity));
        return new PagedResult<FriendRequest>(domainItems, total, pageNumber, pageSize);
    }
    async countPendingReceivedRequests(userId: string): Promise<number> {
        return this.repository.count({
            where: {
                receiverId: userId,
                status: FriendRequestStatus.PENDING
            }
        });
    }
    async countPendingSentRequests(userId: string): Promise<number> {
        return this.repository.count({
        where: {
            senderId: userId,
            status: FriendRequestStatus.PENDING
        }
        });
    }

    async save(friendRequest: FriendRequest): Promise<FriendRequest> {
        const ormEntity = this.mapper.toPersistence(friendRequest);
        const savedEntity = await this.repository.save(ormEntity);
        return this.mapper.toDomain(savedEntity);
    }

    async findById(id: string): Promise<FriendRequest | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.mapper.toDomain(entity) : null;
    }

    async findPendingBetween(senderId: string, receiverId: string): Promise<FriendRequest | null> {
        const entity = await this.repository.findOne({
            where: {
                senderId,
                receiverId,
                status: FriendRequestStatus.PENDING
            }
        });
        return entity ? this.mapper.toDomain(entity) : null;
    }

    async findByReceiver(receiverId: string): Promise<FriendRequest[]> {
        const entities = await this.repository.find({
            where: { receiverId },
            relations: ['sender'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(entity => this.mapper.toDomain(entity));
    }

    async findBySender(senderId: string): Promise<FriendRequest[]> {
        const entities = await this.repository.find({
            where: { senderId },
            relations: ['receiver'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(entity => this.mapper.toDomain(entity));
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}