import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { MyProfileQuery } from "../query/my-profile.query";
import { Result } from "src/shared/response/result.impl";
import { MyProfileOutMapper } from "../../mapper/my-profile.out.mapper";
import { UserQueryService } from "../../service/user.query.service";

@QueryHandler(MyProfileQuery)
export class MyProfileQueryHandler implements IQueryHandler<MyProfileQuery> {
    constructor(
        private readonly mapper: MyProfileOutMapper,
        private readonly userQuery: UserQueryService
    ){}
    async execute(query: MyProfileQuery): Promise<Result<any>> {
        const user = await this.userQuery.getById(query.id);
        if (!user) return Result.error(null, 'User not found');

        const out = this.mapper.toResponse(user);
        return Result.ok(out, 'Profile retrieved successfully');
    }
}
