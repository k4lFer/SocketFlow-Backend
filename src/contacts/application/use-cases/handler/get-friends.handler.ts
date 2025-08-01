import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetFriendsQuery } from "../query/get-friends.query";
import { Inject } from "@nestjs/common";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { Result } from "src/shared/response/result.impl";
import { PagedResult } from "src/shared/domain/paged.result";
import { FriendOutputDto } from "../../dto/out/friend-output.dto";
import { FriendOutputMapper } from "../../mapper/friend-output.mapper";

@QueryHandler(GetFriendsQuery)
export class GetFriendsHandler implements IQueryHandler<GetFriendsQuery> {
    constructor(
        @Inject('IFriendshipQueryRepository')
        private readonly friendshipQueryRepository: IFriendshipRepository,
        private readonly mapper: FriendOutputMapper
    ) {}

    async execute(query: GetFriendsQuery): Promise<Result<PagedResult<FriendOutputDto>>> {
        const { userId, pageNumber, pageSize, searchTerm } = query;

        const pagedResult = await this.friendshipQueryRepository.findFriendsPaged(
            userId,
            pageNumber,
            pageSize,
            searchTerm
        );

        // Mapear a DTOs usando tu mapper
        const mappedItems = this.mapper.toListResponse(pagedResult.items);

            // Crear nuevo PagedResult con DTOs
        const result = new PagedResult<FriendOutputDto>(
            mappedItems,
            pagedResult.totalCount,
            pagedResult.pageNumber,
            pagedResult.pageSize
        );

        return Result.ok(result, 'Friends retrieved successfully');

    }
}