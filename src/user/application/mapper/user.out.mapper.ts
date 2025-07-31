import { Injectable } from "@nestjs/common";
import { User } from "src/user/domain/entity/user.model";
import { UserOutput } from "../dto/out/user.out";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";

@Injectable()
export class UserOutMapper implements BaseResponseMapper<User, UserOutput> {
    toResponse(domain: User): UserOutput {
        throw new Error("Method not implemented.");
    }
    toListResponse(domains: User[]): UserOutput[] {
        throw new Error("Method not implemented.");
    }
}