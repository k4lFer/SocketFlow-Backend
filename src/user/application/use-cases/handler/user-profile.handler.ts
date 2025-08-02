import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserProfileQuery } from "../query/user-profile.query";
import { Result } from "src/shared/response/result.impl";
import { UserQueryService } from "../../service/user.query.service";
import { UserOutMapper } from "../../mapper/user.out.mapper";
import { UserOutput } from "../../dto/out/user.out";
import { MyProfileOutMapper } from "../../mapper/my-profile.out.mapper";
import { MyProfileOutDto } from "../../dto/out/my-profile.dto";

@QueryHandler(UserProfileQuery)
export class UserProfileQueryHandler implements IQueryHandler<UserProfileQuery> {
    constructor(
        private readonly userQuery: UserQueryService,
        private readonly mapper:  UserOutMapper,
        private readonly mapperMe : MyProfileOutMapper
    ) {}
    async execute(query: UserProfileQuery): Promise<Result<UserOutput | MyProfileOutDto>> {
        const { userId, id } = query;

        if (userId === id) {
            const me = await this.userQuery.getById(userId);
            if (me) {
                return Result.ok(this.mapperMe.toResponse(me), "My profile retrieved successfully");
            }
        }

        const user = await this.userQuery.getById(query.id);
        if (!user) {
            return Result.error<any>(null, "User not found");
        }

        const out = this.mapper.toResponse(user);
        return Result.ok(out, "Profile retrieved successfully");
    }
}