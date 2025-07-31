import { Inject, Injectable } from "@nestjs/common";
import { PagedResult } from "src/shared/domain/paged.result";
import { Result } from "src/shared/response/result.impl";
import { IUserRepository } from "src/user/domain/port/user-repository.interface";

@Injectable()
export class SearchUserService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository
    ) {}

    async execute(userId:string, searchTerm: string, pageNumber: number, pageSize?: number): Promise<Result<PagedResult<any>>> {
        const pagedResult = await this.userRepository.searchUsersWithRelationshipStatus(userId, searchTerm, pageNumber, pageSize); // Assuming this always returns a PagedResult, even if empty
        // The searchUsersWithRelationshipStatus method is defined to always return a PagedResult, never null.
        // Therefore, the check `if (!pagedResult)` will never be true based on the current repository interface.
        if(!pagedResult) return Result.error<any>(null, 'No users found')
        return Result.ok(pagedResult, 'Users retrieved successfully');
    }

}