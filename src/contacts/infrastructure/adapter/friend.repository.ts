import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { FriendOrmEntity } from "../orm/friend.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendshipOrmMapper } from "../mapper/friend.orm.mapper";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { Friendship } from "src/contacts/domain/entity/friend.model";
import { PagedResult } from "src/shared/domain/paged.result";

@Injectable()
export class FriendshipRepository implements IFriendshipRepository {
    constructor(
        @InjectRepository(FriendOrmEntity)
        private readonly repository: Repository<FriendOrmEntity>,
        private readonly mapper: FriendshipOrmMapper
    ) {}
    async findFriendsPaged(userId: string, pageNumber?: number, pageSize?: number, searchTerm?: string): Promise<PagedResult<Friendship>> {
        const safePage = pageNumber && pageNumber > 0 ? pageNumber : 1;
        const safePageSize = pageSize && pageSize > 0 ? pageSize : 10;

        const offset = (safePage - 1) * safePageSize;

        const queryBuilder = this.repository.createQueryBuilder('friendship')
        .leftJoinAndSelect('friendship.friend', 'friendUser')
        .leftJoinAndSelect('friendship.user', 'user')
            .where('friendship.userId = :userId', { userId });

        if (searchTerm) {
            queryBuilder.andWhere('friendUser.username LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
        }

        const [entities, total] = await queryBuilder
            .orderBy('friendship.createdAt', 'DESC')
            .skip(offset)
            .take(safePageSize)
            .getManyAndCount();

        const friendships = entities.map(entity => this.mapper.toDomain(entity));

        return new PagedResult<Friendship>(friendships, total, safePage, safePageSize);
    }
    async countFriendsByUserId(userId: string): Promise<number> {
        return this.repository.count({ where: { userId:userId } });
    }

    async save(friendship: Friendship): Promise<Friendship> {
        const ormEntity = this.mapper.toPersistence(friendship);
        const savedEntity = await this.repository.save(ormEntity);
        return this.mapper.toDomain(savedEntity);
    }

    async findById(id: string): Promise<Friendship | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.mapper.toDomain(entity) : null;
    }

    async findByUsers(userId: string, friendId: string): Promise<Friendship | null> {
        const entity = await this.repository.findOne({
            where: [
                { userId, friendId },
                { userId: friendId, friendId: userId }
            ],
            relations: ['friend'] // ← Esta línea es clave
        });
        return entity ? this.mapper.toDomain(entity) : null;
    }

    async findByUserId(userId: string): Promise<Friendship[]> {
        const entities = await this.repository.find({
            where: { userId },
            relations: ['friend'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(entity => this.mapper.toDomain(entity));
    }

    async deleteBidirectional(userId: string, friendId: string): Promise<boolean> {
        const result = await this.repository.delete({ userId, friendId });
        const result2 = await this.repository.delete({ userId: friendId, friendId: userId });
        if (result.affected === 0 && result2.affected === 0) return false;
        return true;        
    }
}