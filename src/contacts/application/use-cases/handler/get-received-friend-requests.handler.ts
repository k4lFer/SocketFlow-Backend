import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetReceivedFriendRequestsQuery } from "../query/get-received-friend-requests.query";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { Inject } from "@nestjs/common";
import { Result } from "src/shared/response/result.impl";
import { PagedResult } from "src/shared/domain/paged.result";
import { FriendRequestOutputDto } from "../../dto/out/friend-request-output.dto";
import { FriendRequestOutMapper } from "../../mapper/frient-request.output.mapper";

@QueryHandler(GetReceivedFriendRequestsQuery)
export class GetReceivedFriendRequestsHandler implements IQueryHandler<GetReceivedFriendRequestsQuery> {
    constructor(
        @Inject('IFriendRequestQueryRepository')
        private readonly friendRequestQueryRepository: IFriendRequestRepository,
        private readonly mapper:  FriendRequestOutMapper
    ) {}

    async execute(query: GetReceivedFriendRequestsQuery): Promise<Result<PagedResult<FriendRequestOutputDto>>> {
        const { userId, pageNumber, pageSize } = query;

        const pagedResult = await this.friendRequestQueryRepository.findReceivedRequestsPaged(
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

        return Result.ok(mapped, 'Received friend requests retrieved successfully');
    }
}