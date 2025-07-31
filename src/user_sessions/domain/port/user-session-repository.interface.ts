import { IGenericRepository } from "src/shared/domain/port/generic.repository.interface";
import { UserSession } from "../entity/user-sessions.model";

export interface IUserSessionRepository extends IGenericRepository<UserSession> {
    findByUserId(userId: string): Promise<UserSession[]>;
    findActiveByUserId(userId: string): Promise<UserSession | null>;
    deactivateSession(sessionId: string): Promise<void>;
    findBySocketId(socketId: string): Promise<UserSession | null>;
}
    
