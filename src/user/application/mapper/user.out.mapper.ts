import { Injectable } from "@nestjs/common";
import { User } from "src/user/domain/entity/user.model";
import { UserOutput } from "../dto/out/user.out";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";

@Injectable()
export class UserOutMapper implements BaseResponseMapper<User, UserOutput> {
    toResponse(domain: User): UserOutput {
        return {
            id: domain.id,
            username: domain.username,
            fullname: (domain.lastName + ' ' + domain.firstName) || '',
            bio: domain.bio || '',
        }
    }
    toListResponse(domains: User[]): UserOutput[] {
        return domains.map(domain => this.toResponse(domain));
    }
}