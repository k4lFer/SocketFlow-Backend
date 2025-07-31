import { Injectable } from "@nestjs/common";
import { UserSession } from "src/user_sessions/domain/entity/user-sessions.model";
import { IUserSessionRepository } from "src/user_sessions/domain/port/user-session-repository.interface";
import { QueryRunner, Repository } from "typeorm";
import { UserSessionOrmMapper } from "../mapper/user-session.orm.mapper";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSessionOrm } from "../orm/user-sessions.orm-entity";

@Injectable()
export class UserSessionRepository implements IUserSessionRepository {
    constructor (
        @InjectRepository(UserSessionOrm)
        private readonly repository: Repository<UserSessionOrm>,

        private readonly mapper: UserSessionOrmMapper
    ) {}

    async findByUserId(userId: string): Promise<UserSession[]> {
        const sessions = await this.repository.find({ where: { userId: userId } });
        return sessions.map((session) => this.mapper.toDomain(session));
    }
    async findActiveByUserId(userId: string): Promise<UserSession | null> {
        throw new Error("Method not implemented.");
    }
    async deactivateSession(sessionId: string): Promise<void> {
        const session = await this.repository.findOne({ where: { id: sessionId } });
        if (!session) throw new Error("Session not found");

        session.isActive = false;
        session.disconnectedAt = new Date();
        await this.repository.save(session);
    }
    async findBySocketId(socketId: string): Promise<UserSession | null> {
        const session = await this.repository.findOne({ where: { socketId: socketId } });
        return session ? this.mapper.toDomain(session) : null;
    }
    async findById(id: string): Promise<UserSession | null> {
        const session = await this.repository.findOne({ where: { id: id } });
        return session ? this.mapper.toDomain(session) : null;
    }
    async save(entity: UserSession, queryRunner?: QueryRunner): Promise<UserSession> {
        const persistence = this.mapper.toPersistence(entity);
        const repo = queryRunner?.manager.getRepository(UserSessionOrm) ?? this.repository;
        const saved = await repo.save(persistence);
        return this.mapper.toDomain(saved);
    }
    update(id: string, entity: UserSession): Promise<UserSession> {
        throw new Error("Method not implemented.");
    }
    async patch(id: string, partial: Partial<UserSession>): Promise<UserSession> {
        const existing = await this.repository.findOne({ where: { id } });
        if (!existing) throw new Error("User session not found.");

        const updates = this.mapper.toPersistence(partial as UserSession);
        Object.assign(existing, updates);

        const saved = await this.repository.save(existing);
        return this.mapper.toDomain(saved);
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    exists(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}