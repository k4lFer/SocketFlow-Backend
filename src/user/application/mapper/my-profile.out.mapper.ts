import { Injectable } from "@nestjs/common";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";
import { User } from "src/user/domain/entity/user.model";
import { MyProfileOutDto } from "../dto/out/my-profile.dto";

@Injectable()
export class MyProfileOutMapper implements BaseResponseMapper<User, MyProfileOutDto> {
    toResponse(domain: User): MyProfileOutDto {
        return {
            id: domain.id,
            username: domain.username,
            email: domain.email,
            fullname: (domain.lastName + ' ' + domain.firstName) || '',
            bio: domain.bio || '',
        }
    }
    toListResponse(domains: User[]): MyProfileOutDto[] {
        throw new Error("Method not implemented.");
    }

}