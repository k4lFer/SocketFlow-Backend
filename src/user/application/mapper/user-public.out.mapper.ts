import { Injectable } from "@nestjs/common";
import { UserPublicDto } from "../dto/out/user-public.dto";
import { User } from "src/user/domain/entity/user.model";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";

@Injectable()
export class UserPublicOutMapper implements BaseResponseMapper<User, UserPublicDto> {
    toResponse(domain: User): UserPublicDto {
        return {
            id: domain.id,
            username: domain.username,
            email: domain.email,
            bio: domain.bio || '',
        }
    }
    toListResponse(domains: User[]): UserPublicDto[] {
        return domains.map(domain => this.toResponse(domain));
    }
    

}