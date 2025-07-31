import { Injectable } from "@nestjs/common";
import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { UserSession } from "src/user_sessions/domain/entity/user-sessions.model";
import { UserSessionOrm} from "../orm/user-sessions.orm-entity";

@Injectable()
export class UserSessionOrmMapper implements BaseDomainMapper<UserSession, UserSessionOrm> {
  toDomain(entity: UserSessionOrm): UserSession {
    return new UserSession(
      entity.id,
      entity.userId,
      entity.socketId,
      entity.ipAddress ?? null,
      entity.connectedAt,
      entity.disconnectedAt ?? null,
      entity.isActive
    );
  }

  toPersistence(domain: UserSession): UserSessionOrm {
    const persistence = new UserSessionOrm();
    persistence.id = domain.id;
    persistence.userId = domain.userId;
    persistence.socketId = domain.socketId;
    persistence.ipAddress = domain.ipAddress ?? '';
    persistence.connectedAt = domain.connectedAt;
    persistence.disconnectedAt = domain.disconnectedAt ?? undefined;
    persistence.isActive = domain.isActive;
    return persistence;
  }
}
