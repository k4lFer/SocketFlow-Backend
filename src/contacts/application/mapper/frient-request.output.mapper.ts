import { Injectable } from "@nestjs/common";
import { FriendRequest } from "src/contacts/domain/entity/friend-request.model";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";
import { FriendRequestOutputDto } from "../dto/out/friend-request-output.dto";

@Injectable()
export class FriendRequestOutMapper implements BaseResponseMapper<FriendRequest, FriendRequestOutputDto> {
    toResponse(domain: FriendRequest): FriendRequestOutputDto {
        return {
            id: domain.id,
            senderId: domain.senderId,
            receiverId: domain.receiverId,
            status: domain.status,
            createdAt: domain.createdAt,
            sender: undefined, // opcional, rellena si lo necesitas
            receiver: undefined
        };
    }
    toListResponse(domains: FriendRequest[]): FriendRequestOutputDto[] {
        return domains.map(domain => this.toResponse(domain));
    }
    
}