import { IGenericRepository } from "src/shared/domain/port/generic.repository.interface";
import { User } from "../entity/user.model";
import { PagedResult } from "src/shared/domain/paged.result";

export interface IUserRepository extends IGenericRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    searchUsersWithRelationshipStatus(
        currentUserId: string,
        searchTerm: string | null,
        pageNumber: number,
        pageSize: number
    ): Promise<PagedResult<User>>;
}