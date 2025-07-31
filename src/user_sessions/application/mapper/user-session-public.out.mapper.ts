import { Injectable } from "@nestjs/common";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";
import { UserSession } from "src/user_sessions/domain/entity/user-sessions.model";
import { UserSessionPublicDto } from "../dto/out/user-session-public.dto";

@Injectable()
export class UserSessionPublicOutMapper implements BaseResponseMapper<UserSession, UserSessionPublicDto> {
    toResponse(domain: UserSession): UserSessionPublicDto {
        return {
            userId: domain.userId,
            connectedAt: domain.connectedAt,
            disconnectedAt: domain.disconnectedAt || null,
            isActive: domain.isActive
        }
    }
    toListResponse(domains: UserSession[]): UserSessionPublicDto[] {
        return domains.map(domain => this.toResponse(domain));
    }
    
}