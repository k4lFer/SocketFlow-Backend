import { IGenericRepository } from "src/shared/domain/port/generic.repository.interface";
import { FriendRequest } from "../entity/friend-request.model";
import { PagedResult } from "src/shared/domain/paged.result";

export interface IFriendRequestRepository {
    save(friendRequest: FriendRequest): Promise<FriendRequest>;
    findById(id: string): Promise<FriendRequest | null>;
    findPendingBetween(senderId: string, receiverId: string): Promise<FriendRequest | null>;
    findByReceiver(receiverId: string): Promise<FriendRequest[]>;
    findBySender(senderId: string): Promise<FriendRequest[]>;
    delete(id: string): Promise<void>;
    findReceivedRequestsPaged(
        userId: string, 
        pageNumber: number, 
        pageSize: number
    ): Promise<PagedResult<FriendRequest>>;
    
    findSentRequestsPaged(
        userId: string, 
        pageNumber: number, 
        pageSize: number
    ): Promise<PagedResult<FriendRequest>>;
    
    countPendingReceivedRequests(userId: string): Promise<number>;
    countPendingSentRequests(userId: string): Promise<number>;
}