import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchUsersQuery } from "../query/search-users.query";
import { IUserRepository } from "src/user/domain/port/user-repository.interface";
import { Result } from "src/shared/response/result.impl";
import { Inject } from "@nestjs/common";
import { PagedResult } from "src/shared/domain/paged.result";
import { UserSearchDto } from "../../dto/out/user-search.dto";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        
        @Inject('IFriendshipRepository')
        private readonly friendshipRepository: IFriendshipRepository,
        
        @Inject('IFriendRequestRepository')
        private readonly friendRequestRepository: IFriendRequestRepository
    ) {}

    async execute(query: SearchUsersQuery): Promise<Result<PagedResult<UserSearchDto>>> {
        const { userId, searchTerm, pageNumber, pageSize } = query;

        // Buscar usuarios usando tu repositorio existente
        const pagedUsers = await this.userRepository.searchUsersWithRelationshipStatus(
                userId,
                searchTerm,
                pageNumber,
                pageSize
        );

            // Para cada usuario, determinar el estado de la relación
        const usersWithRelationship = await Promise.all(
            pagedUsers.items.map(async (user) => {
                const [friendship, sentRequest, receivedRequest] = await Promise.all([
                    this.friendshipRepository.findByUsers(userId, user.id),
                    this.friendRequestRepository.findPendingBetween(userId, user.id),
                    this.friendRequestRepository.findPendingBetween(user.id, userId)
                ]);

                let relationshipStatus: 'none' | 'friends' | 'request_sent' | 'request_received' = 'none';
                    
                if (friendship) {
                    relationshipStatus = 'friends';
                } else if (sentRequest) {
                    relationshipStatus = 'request_sent';
                } else if (receivedRequest) {
                    relationshipStatus = 'request_received';
                }

                const userSearchDto: UserSearchDto = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName ?? '', 
                    lastName: user.lastName ?? '',
                    relationshipStatus,
                    canSendRequest: relationshipStatus === 'none'
                };

                return userSearchDto;
            })
        );

        const result = new PagedResult<UserSearchDto>(
            usersWithRelationship,
            pagedUsers.totalCount,
            pagedUsers.pageNumber,
            pagedUsers.pageSize
        );

        return Result.ok(result, 'Users search completed successfully');
    }
}