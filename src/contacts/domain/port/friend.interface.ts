import { IGenericRepository } from "src/shared/domain/port/generic.repository.interface";
import { Friendship } from "../entity/friend.model";
import { PagedResult } from "src/shared/domain/paged.result";

export interface IFriendshipRepository {
    save(friendship: Friendship): Promise<Friendship>;
    findById(id: string): Promise<Friendship | null>;
    findByUsers(userId: string, friendId: string): Promise<Friendship | null>;
    findByUserId(userId: string): Promise<Friendship[]>;
    deleteBidirectional(userId: string, friendId: string): Promise<boolean>;
    findFriendsPaged(
        userId: string, 
        pageNumber?: number, 
        pageSize?: number
    ): Promise<PagedResult<Friendship>>;
    
    countFriendsByUserId(userId: string): Promise<number>;
}