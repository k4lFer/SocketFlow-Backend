import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetContactsStatsQuery } from "../query/get-contacts-stats.query";
import { Inject } from "@nestjs/common";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { Result } from "src/shared/response/result.impl";
import { ContactsStatsDto } from "../../dto/in/contacts-stats.dto";
import { PagedResult } from "src/shared/domain/paged.result";

@QueryHandler(GetContactsStatsQuery)
export class GetContactsStatsHandler implements IQueryHandler<GetContactsStatsQuery> {
    constructor(
        @Inject('IFriendshipQueryRepository')
        private readonly friendshipQueryRepository: IFriendshipRepository,
        
        @Inject('IFriendRequestQueryRepository')
        private readonly friendRequestQueryRepository: IFriendRequestRepository
    ) {}
    async execute(query: GetContactsStatsQuery): Promise<Result<ContactsStatsDto>> {
        const { userId } = query;

        const [
            friendsCount,
            pendingReceivedRequests,
            pendingSentRequests
        ] = await Promise.all([
            this.friendshipQueryRepository.countFriendsByUserId(userId),
            this.friendRequestQueryRepository.countPendingReceivedRequests(userId),
            this.friendRequestQueryRepository.countPendingSentRequests(userId)
        ]);

        const stats: ContactsStatsDto = {
            friendsCount,
            pendingReceivedRequests,
            pendingSentRequests,
            totalPendingRequests: pendingReceivedRequests + pendingSentRequests
        };
        return Result.ok(stats, 'Contact stats retrieved successfully');
    }


}