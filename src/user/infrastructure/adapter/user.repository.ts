import { Injectable } from "@nestjs/common";
import { User } from "src/user/domain/entity/user.model";
import { IUserRepository } from "src/user/domain/port/user-repository.interface";
import { In, QueryRunner, Repository } from "typeorm";
import { UserOrmMapper } from "../mapper/user.orm.mapper";
import { InjectRepository } from "@nestjs/typeorm";
import { UserOrmEntity } from "../orm/user.orm-entity";
import { PagedResult } from "src/shared/domain/paged.result";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repository: Repository<UserOrmEntity>,

        private readonly mapper: UserOrmMapper
    ) {}
    async searchUsersWithRelationshipStatus(currentUserId: string, searchTerm: string | null, pageNumber: number, pageSize: number): Promise<PagedResult<User>> {
        const offset = (pageNumber - 1) * pageSize;

        const queryBuilder = this.repository.createQueryBuilder('user')
            .where('user.id != :currentUserId', { currentUserId });

        if (searchTerm) {
            queryBuilder.andWhere('user.username LIKE :search', { search: `%${searchTerm}%` });
        }

        queryBuilder.skip(offset).take(pageSize);

        const [users, total] = await queryBuilder.getManyAndCount();

        const domainUsers: User[] = users.map(user => this.mapper.toDomain(user));

        return new PagedResult<User>(domainUsers, total, pageNumber, pageSize);
    }
    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { email: email } });
        return entity ? this.mapper.toDomain(entity) : null;
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.mapper.toDomain(entity) : null;
    }
    async save(entity: User, queryRunner?: QueryRunner): Promise<User> {
        const persistence = this.mapper.toPersistence(entity);
        const repo = queryRunner?.manager.getRepository(UserOrmEntity) ?? this.repository;
        const saved = await repo.save(persistence);
        return this.mapper.toDomain(saved);
    }
    async update(id: string, entity: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async patch(id: string, partial: Partial<User>): Promise<User> {
        const existing = await this.repository.findOne({ where: { id } });
        if (!existing) throw new Error("User not found.");

        const updates = this.mapper.toPersistence(partial as User);
        Object.assign(existing, updates);

        const saved = await this.repository.save(existing);
        return this.mapper.toDomain(saved);
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async exists(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}