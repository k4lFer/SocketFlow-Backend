import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetSentFriendRequestsQuery } from "../query/get-sent-friend-requests.query";
import { Inject } from "@nestjs/common";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { Result } from "src/shared/response/result.impl";
import { PagedResult } from "src/shared/domain/paged.result";
import { FriendRequestOutputDto } from "../../dto/out/friend-request-output.dto";
import { FriendRequestOutMapper } from "../../mapper/frient-request.output.mapper";

@QueryHandler(GetSentFriendRequestsQuery)
export class GetSentFriendRequestsHandler implements IQueryHandler<GetSentFriendRequestsQuery> {
    constructor(
        @Inject('IFriendRequestQueryRepository')
        private readonly friendRequestQueryRepository: IFriendRequestRepository,
        private readonly mapper:  FriendRequestOutMapper
    ) {}

    async execute(query: GetSentFriendRequestsQuery): Promise<Result<PagedResult<FriendRequestOutputDto>>> {
        const { userId, pageNumber, pageSize } = query;

        const pagedResult = await this.friendRequestQueryRepository.findSentRequestsPaged(
            userId,
            pageNumber,
            pageSize
        );

        const mapped = new PagedResult<FriendRequestOutputDto>(
            this.mapper.toListResponse(pagedResult.items),
            pagedResult.totalCount,
            pagedResult.pageNumber,
            pagedResult.pageSize
        );

        return Result.ok(mapped, 'Sent friend requests retrieved successfully');
    }
}