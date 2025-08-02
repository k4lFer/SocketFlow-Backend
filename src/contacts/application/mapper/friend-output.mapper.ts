import { Friendship } from "src/contacts/domain/entity/friend.model";
import { FriendOutputDto } from "../dto/out/friend-output.dto";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";

export class FriendOutputMapper implements BaseResponseMapper<Friendship, FriendOutputDto> {
    toResponse(domain: Friendship): FriendOutputDto {
        return {
            id: domain.id,
            userId: domain.userId,
            friendId: domain.friendId,
            createdAt: domain.createdAt,
            friend: {
                id: domain.friendId, // si tienes los datos relacionados del "friend", los llenas aquí
                username: domain.user.username,
                fullname: domain.user.firstName + ' ' + domain.user.lastName,
                bio: domain.user.bio, 
            }
        };        
    }
    toListResponse(domains: Friendship[]): FriendOutputDto[] {
        return domains.map(domain => this.toResponse(domain));
    }

}